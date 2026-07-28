"use client";

import "@/styles/exercises/exercises.scss";
import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { getExercises, type Exercise } from "@/lib/exercises-client";
import NewExerciseModal from "@/components/exercises/NewExerciseModal";
import EditExerciseModal from "@/components/exercises/EditExerciseModal";

const MUSCLE_GROUPS = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load exercises.");
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, []);

  function handleExerciseCreated(exercise: Exercise) {
    setExercises((prev) => [...prev, exercise]);
  }

  function handleExerciseUpdated(exercise: Exercise) {
    setExercises((prev) => prev.map((item) => (item.id === exercise.id ? exercise : item)));
  }

  const filteredExercises = exercises.filter((exercise) => {
    const matchesFilter =
      activeFilter === "All" || exercise.muscleGroup.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isEmpty = !isLoading && !error && exercises.length === 0;

  return (
    <div className="exercises-page">
      <div className="exercises-page__header">
        <div className="exercises-page__header__text">
          <div className="exercises-page__header__text__title">Exercise bank</div>
          <div className="exercises-page__header__text__subtext">{exercises.length} exercises · your personal library</div>
        </div>

        <div className="exercises-page__header-actions">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="exercises-page__search"
          />
          <button className="exercises-page__new-button" onClick={() => setIsModalOpen(true)}>
            + New exercise
          </button>
        </div>
      </div>

      {!isEmpty && (
        <div className="exercises-page__filters">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setActiveFilter(group)}
              className={`exercises-page__filter-pill ${
                activeFilter === group ? "exercises-page__filter-pill--active" : ""
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      )}

      {isLoading && <p>Loading exercises...</p>}
      {error && <p className="exercises-page__error">{error}</p>}

      {isEmpty && (
        <div className="exercises-page__empty-state">
          <h2>Your bank is empty</h2>
          <p>
            Add the moves you actually do. Every exercise here can be dropped into any workout.
          </p>
          <button className="exercises-page__new-button" onClick={() => setIsModalOpen(true)}>
            + Create first exercise
          </button>
        </div>
      )}

      {!isLoading && !error && !isEmpty && (
        <div className="exercises-page__grid">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <button
                className="exercise-card__menu-button"
                onClick={() => setEditingExercise(exercise)}
                aria-label={`Edit ${exercise.name}`}
              >
                <MoreHorizontal size={18} />
              </button>

              <div className="exercise-card__icon">
                placeholder
              </div>

              <div className="exercise-card__body">
                <h3>{exercise.name}</h3>
                <div className="exercise-card__meta">
                  <span className="exercise-card__badge">{exercise.muscleGroup}</span>
                  <span className="exercise-card__equipment">{exercise.equipment}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <p className="exercises-page__empty">No exercises match your filters yet.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <NewExerciseModal onClose={() => setIsModalOpen(false)} onCreated={handleExerciseCreated} />
      )}

      {editingExercise && (
        <EditExerciseModal
          exercise={editingExercise}
          onClose={() => setEditingExercise(null)}
          onUpdated={handleExerciseUpdated}
        />
      )}
    </div>
  );
}