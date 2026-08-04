"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Plus, Search, PersonStanding, X } from "lucide-react";
import "@/styles/workouts/workouts.scss";
import { createWorkout } from "@/lib/workouts-client";
import { getExercises, type Exercise } from "@/lib/exercises-client";
import NewExerciseModal from "@/components/exercises/NewExerciseModal";

type SelectedExercise = {
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: number;
};

export default function NewWorkoutPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [selected, setSelected] = useState<SelectedExercise[]>([]);
    const [query, setQuery] = useState("");
    const [showNewExerciseModal, setShowNewExerciseModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getExercises().then(setAvailableExercises).catch(() => {});
    }, []);

    const filteredExercises = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return availableExercises;
        return availableExercises.filter((exercise) => exercise.name.toLowerCase().includes(q));
    }, [availableExercises, query]);

    function addExercise(exercise: Exercise) {
        setSelected((prev) => [
            ...prev,
            { exerciseId: exercise.id, exerciseName: exercise.name, targetSets: 3, targetReps: 10 },
        ]);
    }

    function removeExercise(exerciseId: string) {
        setSelected((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
    }

    async function handleSave() {
        if (!name.trim() || selected.length === 0) {
            setError("Name and at least one exercise are required.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await createWorkout({
                name,
                exercises: selected.map((e, index) => ({
                    exerciseId: e.exerciseId,
                    orderIndex: index,
                    targetSets: e.targetSets,
                    targetReps: e.targetReps,
                })),
            });
            router.replace("/workouts");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save workout.");
        } finally {
            setIsSaving(false);
        }
    }

    const canSave = name.trim().length > 0 && selected.length > 0 && !isSaving;

    return (
        <div className="new-workout">
            <div className="new-workout__main">
                <div className="new-workout__left">
                    <div className="new-workout__left__heading">
                        <input
                            className="new-workout__left__heading__input"
                            placeholder="Untitled workout"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <div className="new-workout__left__heading__info">
                            {selected.length} exercise{selected.length === 1 ? "" : "s"} · name it, then start adding
                            moves
                        </div>
                    </div>

                    {selected.length === 0 ? (
                        <div className="new-workout__empty">
                            <div className="new-workout__empty__icon">
                                <ClipboardList size={26} />
                            </div>
                            <div className="new-workout__empty__title">No exercises yet</div>
                            <div className="new-workout__empty__subtitle">
                                Pull moves from your bank on the right, or create a new one on the fly.
                            </div>
                            <div className="new-workout__empty__actions">
                                <button
                                    className="new-workout__empty__add-bank"
                                    onClick={() => searchInputRef.current?.focus()}
                                >
                                    + Add from bank
                                </button>
                                <button
                                    className="new-workout__empty__add-new"
                                    onClick={() => setShowNewExerciseModal(true)}
                                >
                                    + New exercise
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="new-workout__list">
                            {selected.map((exercise, index) => (
                                <div className="new-workout__list-item" key={`${exercise.exerciseId}-${index}`}>
                                    <span className="new-workout__list-item__index">{index + 1}</span>
                                    <span className="new-workout__list-item__name">{exercise.exerciseName}</span>
                                    <span className="new-workout__list-item__meta">
                                        {exercise.targetSets} x {exercise.targetReps}
                                    </span>
                                    <button
                                        className="new-workout__list-item__remove"
                                        onClick={() => removeExercise(exercise.exerciseId)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <p className="new-workout__error">{error}</p>}
                </div>

                <div className="new-workout__right">
                    <div className="new-workout__right__header">
                        <div className="new-workout__right__header__title">Add from bank</div>
                        <div className="new-workout__right__header__subtitle">Tap to drop into the workout →</div>
                    </div>

                    <div className="new-workout__right__search">
                        <Search size={16} className="new-workout__right__search__icon" />
                        <input
                            ref={searchInputRef}
                            className="new-workout__right__search__input"
                            placeholder="Search bank..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="new-workout__right__list">
                        {filteredExercises.map((exercise) => (
                            <div className="new-workout__bank-item" key={exercise.id}>
                                <div className="new-workout__bank-item__icon">
                                    <PersonStanding size={18} />
                                </div>
                                <div className="new-workout__bank-item__text">
                                    <div className="new-workout__bank-item__name">{exercise.name}</div>
                                    <div className="new-workout__bank-item__meta">
                                        {exercise.muscleGroup} · {exercise.equipment}
                                    </div>
                                </div>
                                <button
                                    className="new-workout__bank-item__add"
                                    onClick={() => addExercise(exercise)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="new-workout__footer">
                <button className="new-workout__footer__cancel" onClick={() => router.push("/workouts")}>
                    Cancel
                </button>
                <button className="new-workout__footer__save" onClick={handleSave} disabled={!canSave}>
                    {isSaving ? "Saving..." : "Save workout"}
                </button>
            </div>

            {showNewExerciseModal && (
                <NewExerciseModal
                    onClose={() => setShowNewExerciseModal(false)}
                    onCreated={(exercise) => {
                        setAvailableExercises((prev) => [...prev, exercise]);
                        addExercise(exercise);
                    }}
                />
            )}
        </div>
    );
}
