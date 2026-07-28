import { authorizedFetch } from "@/lib/auth-client";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
};

type CreateExercisePayload = {
  name: string;
  muscleGroup: string;
  equipment: string;
};

type UpdateExercisePayload = {
  name: string;
  muscleGroup: string;
  equipment: string;
};

export async function getExercises(): Promise<Exercise[]> {
  const res = await authorizedFetch("/exercises");
  return res.json();
}

export async function getExercise(id: string): Promise<Exercise> {
  const res = await authorizedFetch(`/exercises/${id}`);
  return res.json();
}

export async function createExercise(payload: CreateExercisePayload): Promise<Exercise> {
  const res = await authorizedFetch("/exercises", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateExercise(id: string, payload: UpdateExercisePayload): Promise<Exercise> {
  const res = await authorizedFetch(`/exercises/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteExercise(id: string): Promise<void> {
  await authorizedFetch(`/exercises/${id}`, {
    method: "DELETE",
  });
}