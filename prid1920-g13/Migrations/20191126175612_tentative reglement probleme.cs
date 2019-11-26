using Microsoft.EntityFrameworkCore.Migrations;

namespace prid_1819_g13.Migrations
{
    public partial class tentativereglementprobleme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 10);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
