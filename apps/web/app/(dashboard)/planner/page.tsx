"use client";

import "@/styles/planner/planner.scss";
import { useEffect, useState } from "react";
import { getSchedules, type Schedule } from "@/lib/planner-client";

export default function PlannerPage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadSchedules() {
            try {
                const data = await getSchedules();
                console.log(data);
                setSchedules(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load schedule")
            } finally {
                setIsLoading(false);
            }
        }

        loadSchedules()
    }, []);

    return (
        <div className="planner">
            <div className="planner__header">
                <div className="planner__header__left">
                    <div className="planner__header__left__text">This week</div>
                    <div className="planner__header__left__dates">Jun 29 - Jul 5</div>
                </div>
                <div className="planner__header__right">
                    <div className="planner__header__right__number">3 planned</div>
                    <div className="planner__header__right__time">~ 2.5h</div>
                </div>
            </div>
            <div className="planner__calendar">
                <div className="planner__calendar__days">
                    <div className="planner__calendar__days__day">
                        <div className="planner__calendar__days__day__date">
                            <span>MONDAY</span>
                            <span>29</span>
                        </div>
                        <div className="planner__days__day__workout"></div>
                    </div>
                </div>
                <div className="planner__calendar__workout-bank"></div>
            </div>
        </div>
    );
}