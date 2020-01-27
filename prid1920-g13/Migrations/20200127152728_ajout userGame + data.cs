using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace prid_1819_g13.Migrations
{
    public partial class ajoutuserGamedata : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "expected_release_day",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "expected_release_month",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "expected_release_year",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "platforms",
                table: "Games",
                newName: "Platforms");

            migrationBuilder.RenameColumn(
                name: "image",
                table: "Games",
                newName: "Image");

            migrationBuilder.AddColumn<DateTime>(
                name: "Expected_released_date",
                table: "Games",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expected_released_date",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "Platforms",
                table: "Games",
                newName: "platforms");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Games",
                newName: "image");

            migrationBuilder.AddColumn<int>(
                name: "expected_release_day",
                table: "Games",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "expected_release_month",
                table: "Games",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "expected_release_year",
                table: "Games",
                nullable: false,
                defaultValue: 0);
        }
    }
}
