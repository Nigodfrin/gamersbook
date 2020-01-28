using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace prid_1819_g13.Migrations
{
    public partial class expected_date : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expected_released_date",
                table: "Games");

            migrationBuilder.AddColumn<int>(
                name: "Expected_released_day",
                table: "Games",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Expected_released_month",
                table: "Games",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Expected_released_year",
                table: "Games",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expected_released_day",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Expected_released_month",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Expected_released_year",
                table: "Games");

            migrationBuilder.AddColumn<DateTime>(
                name: "Expected_released_date",
                table: "Games",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
