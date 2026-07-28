"use client";

import { useState } from "react";
import { updateExercise, type Exercise } from "@/lib/exercises-client";

const MUSCLE_GROUP_OPTIONS = ["Chest", "Shoulders", "Back", "Legs", "Arms", "Core"];
const EQUIPMENT_OPTIONS = ["Barbell", "Dumbbell", "Machine", "Bodyweight", "Cable", "Kettlebell"];

type EditExerciseModalProps = {
  exercise: Exercise;
  onClose: () => void;
  onUpdated: (exercise: Exercise) => void;
};

export default function EditExerciseModal({ exercise, onClose, onUpdated }: EditExerciseModalProps) {
  const [name, setName] = useState(exercise.name);
  const [muscleGroup, setMuscleGroup] = useState(exercise.muscleGroup);
  const [equipment, setEquipment] = useState(exercise.equipment);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updated = await updateExercise(exercise.id, { name, muscleGroup, equipment });
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save exercise.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="exercise-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="exercise-modal" role="dialog" aria-modal="true">
        <div className="exercise-modal__header">
          <h2>Edit exercise</h2>
          <button onClick={onClose} className="exercise-modal__close">
            ✕
          </button>
        </div>

        <div className="exercise-modal__body">
          <label className="exercise-modal__label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="exercise-modal__input"
            autoFocus
          />

          <label className="exercise-modal__label">Muscle group</label>
          <div className="exercise-modal__pills">
            {MUSCLE_GROUP_OPTIONS.map((group) => (
              <button
                key={group}
                onClick={() => setMuscleGroup(group)}
                className={`exercise-modal__pill ${
                  muscleGroup === group ? "exercise-modal__pill--active" : ""
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <label className="exercise-modal__label">Equipment</label>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="exercise-modal__select"
          >
            {EQUIPMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {error && <p className="exercise-modal__error">{error}</p>}
        </div>

        <div className="exercise-modal__footer">
          <button onClick={handleSave} disabled={isSaving} className="exercise-modal__save">
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          <button onClick={onClose} className="exercise-modal__cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
