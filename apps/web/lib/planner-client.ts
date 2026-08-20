import { authorizedFetch } from "./auth-client";

export type Schedule = {
    id: string;
    workoutId: string;
    workoutName: string;
    dayOfWeek: string;
}

type CreateSchedulePayload = {
    workoutId: string;
    dayOfWeek: string;
}

type UpdateSchedulePayload = {
    workoutId: string;
    dayOfWeek: string;
}

export async function getSchedules(): Promise<Schedule[]> {
    const res = await authorizedFetch("/schedules");
    return res.json();
}

export async function getSchedule(id: string): Promise<Schedule> {
    const res = await authorizedFetch(`/schedules/${id}`);
    return res.json();
}

export async function createSchedule(payload: CreateSchedulePayload): Promise<Schedule> {
    const res = await authorizedFetch("/schedules", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function updateSchedule(id: string, payload: UpdateSchedulePayload): Promise<Schedule> {
    const res = await authorizedFetch(`/schedules/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function deleteSchedule(id: string) {
    await authorizedFetch(`/schedules/${id}`, {
        method: "DELETE",
    });
}