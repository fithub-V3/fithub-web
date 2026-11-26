"use client";

import "@/styles/planner/planner.scss";
import { useEffect, useState } from "react";
import { getSchedules, type Schedule, DAY_NAMES, WEEK_DAYS } from "@/lib/planner-client";
import { getWorkouts, Workout } from "@/lib/workouts-client";

const MINUTES_PER_SET = 2.5 // Move this to the backend
const WORKOUT_COLORS = ["#34d17e", "#3b82f6", "#f0a13a", "#a855f7"];

function startOfWeek(date: Date) {
    let monday = new Date(date);
    const offset = (date.getDay() + 6) % 7; // how many days since monday
    monday.setDate(date.getDate() - offset); // go back that many days
    monday.setHours(0,0,0,0); // set the time to midnight
    return monday;
}   

function addDays(date: Date, days: number) {
    let copy = new Date(date);
    copy.setDate(date.getDate() + days);
    return copy;
}

function formatShortDate(date: Date) {
    let copy = new Date(date);
    return copy.toLocaleDateString(undefined, {month: "short", day: "numeric"})
}

function formatDuration(minutes: number) {
    if (minutes < 60) {
        return Math.round(minutes);
    }
    const hours = Math.round(minutes / 60 * 2) / 2;
    return hours;
}

export default function PlannerPage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const today = new Date();
    const monday = startOfWeek(today);
    const sunday = addDays(monday, 6);

    function getWorkout(id: string) {
        return workouts.find((w) => w.id === id);
    }

    function workoutMinutes(id: string) {
        const workout = getWorkout(id);
        if (workout == undefined) return 0;
        const totalSets = workout.exercises.reduce((total, we) => total + we.targetSets, 0);
        return totalSets * MINUTES_PER_SET;
    }

    useEffect(() => {
        async function loadData() {
            try {
                const [scheduleData, workoutData] = await Promise.all([getSchedules(), getWorkouts()]);
                setWorkouts(workoutData);
                setSchedules(scheduleData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load schedule")
            } finally {
                setIsLoading(false);
            }
        }

        loadData()
    }, []);

    if (isLoading) {
        return <div className="planner__status">Loading your week...</div>
    }
    if (error !== null) {
        return <div className="planner__status">Error loading your week: {error}</div>
    }

    return (
        <div className="planner">
            <div className="planner__header">
                <div className="planner__header__left">
                    <div className="planner__header__left__text">This week</div>
                    <div className="planner__header__left__dates">{formatShortDate(monday)} - {formatShortDate(sunday)}</div>
                </div>
                <div className="planner__header__right">
                    <div className="planner__header__right__number">{schedules.length} planned</div>
                    <div className="planner__header__right__time">~ 2.5h</div>
                </div>
            </div>
            <div className="planner__calendar">
                <div className="planner__calendar__days">
                    {WEEK_DAYS.map((day, index) => {
                        const date = addDays(monday, index);
                        const isToday = date.toDateString() === today.toDateString();
                        const daySchedules = schedules.filter((s) => s.dayOfWeek === day);

                        return (
                            <div
                                key={day}
                                className={`planner__calendar__days__day ${isToday ? "planner__calendar__days__day--today" : ""}`}
                            >
                                <div className="planner__calendar__days__day__date">
                                    <span>{DAY_NAMES[day].slice(0, 3).toUpperCase()}</span>
                                    <span>{date.getDate()} {isToday && <span>- today</span>}</span>
                                </div>

                                <div className="planner__calendar__days__day__workouts">
                                    {daySchedules.length === 0 ? (
                                        <div className="planner__calendar__days__day__rest">Rest day</div>
                                    ) : (
                                        daySchedules.map((schedule) => (
                                            <div key={schedule.id} className="planner__card">{schedule.workoutName}</div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="planner__calendar__workout-bank"></div>
            </div>
        </div>
    );
}