using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fithub.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixExerciseCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_exercises_users_created_by",
                table: "exercises");

            migrationBuilder.AddForeignKey(
                name: "FK_exercises_users_created_by",
                table: "exercises",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_exercises_users_created_by",
                table: "exercises");

            migrationBuilder.AddForeignKey(
                name: "FK_exercises_users_created_by",
                table: "exercises",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
