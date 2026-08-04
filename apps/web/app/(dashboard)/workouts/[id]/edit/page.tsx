"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { GripVertical, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import "@/styles/workouts/workouts.scss";
import { getWorkout, updateWorkout } from "@/lib/workouts-client";
import { getExercises, type Exercise } from "@/lib/exercises-client";

type SelectedExercise = {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
};

export default function EditWorkoutPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [workout, exercises] = await Promise.all([getWorkout(id), getExercises()]);
        setName(workout.name);
        setSelected(
          workout.exercises
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((e) => ({
              exerciseId: e.exerciseId,
              exerciseName: e.exerciseName,
              targetSets: e.targetSets,
              targetReps: e.targetReps,
            }))
        );
        setAvailableExercises(exercises);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load workout.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const muscleGroups = useMemo(() => {
    const ids = new Set(selected.map((e) => e.exerciseId));
    const groups = availableExercises.filter((e) => ids.has(e.id)).map((e) => e.muscleGroup);
    return [...new Set(groups)];
  }, [availableExercises, selected]);

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

  function removeExercise(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTargets(index: number, targetSets: number, targetReps: number) {
    setSelected((prev) => prev.map((e, i) => (i === index ? { ...e, targetSets, targetReps } : e)));
  }

  async function handleSave() {
    if (!name.trim() || selected.length === 0) {
      setError("Name and at least one exercise are required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateWorkout(id, {
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

  if (isLoading) {
    return <div className="new-workout__loading">Loading workout...</div>;
  }

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
            />
            <div className="new-workout__pills">
              {muscleGroups.map((group) => (
                <span className="new-workout__pill" key={group}>
                  <span className="new-workout__pill__dot" />
                  {group}
                </span>
              ))}
              <span className="new-workout__meta">
                · {selected.length} exercise{selected.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="new-workout__exercises">
            {selected.map((exercise, index) => (
              <div className="new-workout__exercise" key={`${exercise.exerciseId}-${index}`}>
                <div className="new-workout__exercise__header">
                  <GripVertical size={16} className="new-workout__exercise__grip" />
                  <span className="new-workout__exercise__index">{index + 1}</span>
                  <span className="new-workout__exercise__name">{exercise.exerciseName}</span>
                  <button
                    className="new-workout__exercise__menu"
                    onClick={() => removeExercise(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="new-workout__exercise__stats">
                  <label className="new-workout__exercise__stat">
                    <span className="new-workout__exercise__stat__label">Sets</span>
                    <input
                      type="number"
                      min={1}
                      className="new-workout__exercise__stat__value"
                      value={exercise.targetSets}
                      onChange={(e) =>
                        updateTargets(index, Number(e.target.value) || 1, exercise.targetReps)
                      }
                    />
                  </label>
                  <label className="new-workout__exercise__stat">
                    <span className="new-workout__exercise__stat__label">Reps</span>
                    <input
                      type="number"
                      min={1}
                      className="new-workout__exercise__stat__value"
                      value={exercise.targetReps}
                      onChange={(e) =>
                        updateTargets(index, exercise.targetSets, Number(e.target.value) || 1)
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            className="new-workout__add-exercise"
            onClick={() => searchInputRef.current?.focus()}
          >
            + Add exercise from bank
          </button>

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
                <span className="new-workout__bank-item__dot" />
                <div className="new-workout__bank-item__text">
                  <div className="new-workout__bank-item__name">{exercise.name}</div>
                  <div className="new-workout__bank-item__meta">
                    {exercise.muscleGroup} · {exercise.equipment}
                  </div>
                </div>
                <button className="new-workout__bank-item__add" onClick={() => addExercise(exercise)}>
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
    </div>
  );
}
