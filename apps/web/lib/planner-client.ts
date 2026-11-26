import { authorizedFetch } from "./auth-client";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5| 6; // In backend, this is sent as a DAyOfWeek enum, which is a number

export type Schedule = {
    id: string;
    workoutId: string;
    workoutName: string;
    dayOfWeek: DayOfWeek;
}

export const WEEK_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];
export const DAY_NAMES: Record<DayOfWeek, string> = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};

type CreateSchedulePayload = {
    workoutId: string;
    dayOfWeek: DayOfWeek;
}

type UpdateSchedulePayload = {
    workoutId: string;
    dayOfWeek: DayOfWeek;
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