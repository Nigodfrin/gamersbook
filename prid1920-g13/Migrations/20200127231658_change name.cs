using Microsoft.EntityFrameworkCore.Migrations;

namespace prid_1819_g13.Migrations
{
    public partial class changename : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Expected_released_year",
                table: "Games",
                newName: "Expected_release_year");

            migrationBuilder.RenameColumn(
                name: "Expected_released_month",
                table: "Games",
                newName: "Expected_release_month");

            migrationBuilder.RenameColumn(
                name: "Expected_released_day",
                table: "Games",
                newName: "Expected_release_day");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Expected_release_year",
                table: "Games",
                newName: "Expected_released_year");

            migrationBuilder.RenameColumn(
                name: "Expected_release_month",
                table: "Games",
                newName: "Expected_released_month");

            migrationBuilder.RenameColumn(
                name: "Expected_release_day",
                table: "Games",
                newName: "Expected_released_day");
        }
    }
}
