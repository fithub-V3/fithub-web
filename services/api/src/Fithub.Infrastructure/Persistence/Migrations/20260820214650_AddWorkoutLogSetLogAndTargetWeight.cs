using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fithub.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkoutLogSetLogAndTargetWeight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_set_logs_exercises_exercise_id",
                table: "set_logs");

            migrationBuilder.RenameColumn(
                name: "exercise_id",
                table: "set_logs",
                newName: "workout_exercise_id");

            migrationBuilder.RenameIndex(
                name: "IX_set_logs_exercise_id",
                table: "set_logs",
                newName: "IX_set_logs_workout_exercise_id");

            migrationBuilder.AddColumn<Guid>(
                name: "schedule_id",
                table: "workout_logs",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "target_weight_kg",
                table: "workout_exercises",
                type: "numeric(6,2)",
                precision: 6,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_workout_logs_schedule_id",
                table: "workout_logs",
                column: "schedule_id");

            migrationBuilder.AddForeignKey(
                name: "FK_set_logs_workout_exercises_workout_exercise_id",
                table: "set_logs",
                column: "workout_exercise_id",
                principalTable: "workout_exercises",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workout_logs_schedules_schedule_id",
                table: "workout_logs",
                column: "schedule_id",
                principalTable: "schedules",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_set_logs_workout_exercises_workout_exercise_id",
                table: "set_logs");

            migrationBuilder.DropForeignKey(
                name: "FK_workout_logs_schedules_schedule_id",
                table: "workout_logs");

            migrationBuilder.DropIndex(
                name: "IX_workout_logs_schedule_id",
                table: "workout_logs");

            migrationBuilder.DropColumn(
                name: "schedule_id",
                table: "workout_logs");

            migrationBuilder.DropColumn(
                name: "target_weight_kg",
                table: "workout_exercises");

            migrationBuilder.RenameColumn(
                name: "workout_exercise_id",
                table: "set_logs",
                newName: "exercise_id");

            migrationBuilder.RenameIndex(
                name: "IX_set_logs_workout_exercise_id",
                table: "set_logs",
                newName: "IX_set_logs_exercise_id");

            migrationBuilder.AddForeignKey(
                name: "FK_set_logs_exercises_exercise_id",
                table: "set_logs",
                column: "exercise_id",
                principalTable: "exercises",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
