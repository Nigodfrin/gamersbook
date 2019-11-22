using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace prid_1819_g13.Migrations
{
    public partial class AddValues : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Votes",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    PostId = table.Column<int>(nullable: false),
                    UpDown = table.Column<int>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Votes", x => new { x.UserId, x.PostId });
                });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "Body", "Timestamp", "Title", "UserId" },
                values: new object[,]
                {
                    { 1, "salut c'est cool", new DateTime(2019, 10, 3, 11, 11, 11, 0, DateTimeKind.Unspecified), "Essai", 1 },
                    { 2, "salut c'est cool2", new DateTime(2018, 8, 21, 13, 11, 11, 0, DateTimeKind.Unspecified), "Essai2", 1 },
                    { 3, "salut c'est cool3", new DateTime(2018, 2, 26, 1, 24, 5, 0, DateTimeKind.Unspecified), null, 2 }
                });

            migrationBuilder.InsertData(
                table: "Votes",
                columns: new[] { "UserId", "PostId", "Timestamp", "UpDown" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2019, 10, 3, 13, 25, 42, 0, DateTimeKind.Unspecified), 1 },
                    { 2, 1, new DateTime(2019, 10, 3, 13, 45, 42, 0, DateTimeKind.Unspecified), 1 },
                    { 1, 2, new DateTime(2019, 5, 3, 13, 55, 42, 0, DateTimeKind.Unspecified), 1 },
                    { 1, 3, new DateTime(2019, 1, 3, 13, 25, 42, 0, DateTimeKind.Unspecified), -1 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Votes");
        }
    }
}
