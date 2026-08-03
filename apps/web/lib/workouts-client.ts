import { authorizedFetch } from "./auth-client";
import { Exercise } from "./exercises-client";

export type WorkoutExercise = {
    id: string;
    exerciseId: string;
    exerciseName: string;
    orderIndex: number;
    targetSets: number;
    targetReps: number;
}

export type Workout = {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
}

type CreateWorkoutExercisePayload = {
    exerciseId: string;
    orderIndex: number;
    targetSets: number;
    targetReps: number;
}

type CreateWorkoutPayload = {
    name: string;
    exercises: CreateWorkoutExercisePayload[];
}

type UpdateWorkoutExercisePayload = {
    exerciseId: string;
    orderIndex: number;
    targetSets: number;
    targetReps: number;
}

type UpdateWorkoutPayload = {
    name: string;
    exercises: UpdateWorkoutExercisePayload[];
}

export async function getWorkouts(): Promise<Workout[]> {
    const res = await authorizedFetch("/workouts");
    return res.json();
}

export async function getWorkout(id: string): Promise<Workout> {
    const res = await authorizedFetch(`/workouts/${id}`);
    return res.json();
}

export async function createWorkout(payload: CreateWorkoutPayload): Promise<Workout> {
    const res = await authorizedFetch("/workouts", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function updateWorkout(id: string, payload: UpdateWorkoutPayload): Promise<Workout> {
    const res = await authorizedFetch(`/workouts/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function deleteWorkout(id: string): Promise<void> {
    await authorizedFetch(`/workouts/${id}`, {
        method: "DELETE",
    });
}