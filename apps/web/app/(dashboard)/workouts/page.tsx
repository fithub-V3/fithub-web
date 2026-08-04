"use client";

import { useRouter } from "next/navigation";
import "@/styles/workouts/workouts.scss";
import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { getWorkouts, type Workout, type WorkoutExercise } from "@/lib/workouts-client";
import { getExercises, type Exercise } from "@/lib/exercises-client";


export default function WorkoutsPage() {
    const router = useRouter();
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [workoutExercise, setWorkoutExercise] = useState<WorkoutExercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadWorkouts() {
            try {
                const data = await getWorkouts();
                console.log(data);
                setWorkouts(data);
            } catch (err) {
                console.log(err);
                setError(err instanceof Error ? err.message : "Failed to load workouts");
            } finally {
                setIsLoading(false);
            }
       
        }
        loadWorkouts();
    }, []);

    useEffect(() => {
        async function loadExercises() {
            const data = await getExercises();
            setAllExercises(data);
        }
        loadExercises();
    }, [])

    function getMuscleGroups(workout: Workout): string[] {
        const ids = new Set(workout.exercises.map((we) => we.exerciseId));
        const groups = allExercises.filter((e) => ids.has(e.id)).map((e) => e.muscleGroup);
        return [...new Set(groups)];
    }

    return (
        <div className="workouts-page">
            <div className="workouts-page__header">
                <div className="workouts-page__header__text">
                    <div className="workouts-page__header__text__title">Workouts</div>
                    <div className="workouts-page__header__text__subtitle">{workouts.length} Workouts</div>
                </div>
                <div className="workouts-page__header-actions">
                    <button className="workouts-page__new-button" onClick={() => router.push("/workouts/new")}>
                        + New workout
                    </button>
                </div>

            </div>
            <div className="workouts-page__table">
                <table className="workouts-table">
                    <thead>
                        <tr>
                            <th>Workout</th>
                            <th>Focus</th>
                            <th>Moves</th>
                            <th>Est.</th>
                            <th>Last done</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.map((workout) => (
                            <tr key={workout.id}>
                                <td>
                                    <span className="workouts-table__dot"></span>
                                    <span className="workouts-table__name">{workout.name}</span>
                                </td>
                                <td className="workouts-table__muted">
                                    {getMuscleGroups(workout).join(" . ")}
                                </td>
                                <td>{workout.exercises.length}</td>
                                <td className="workouts-table__muted">-</td>
                                <td className="workouts-table__muted">-</td>
                                <td>
                                    <button
                                        className="workouts-table__menu"
                                        onClick={() => router.push(`/workouts/${workout.id}/edit`)}
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}