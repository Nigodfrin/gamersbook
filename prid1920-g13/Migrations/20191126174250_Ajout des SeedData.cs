using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace prid_1819_g13.Migrations
{
    public partial class AjoutdesSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Votes",
                keyColumns: new[] { "UserId", "PostId" },
                keyValues: new object[] { 1, 1 });

            migrationBuilder.DeleteData(
                table: "Votes",
                keyColumns: new[] { "UserId", "PostId" },
                keyValues: new object[] { 1, 2 });

            migrationBuilder.DeleteData(
                table: "Votes",
                keyColumns: new[] { "UserId", "PostId" },
                keyValues: new object[] { 1, 3 });

            migrationBuilder.DeleteData(
                table: "Votes",
                keyColumns: new[] { "UserId", "PostId" },
                keyValues: new object[] { 2, 1 });

            migrationBuilder.DropColumn(
                name: "Timestamp",
                table: "Votes");

            migrationBuilder.RenameColumn(
                name: "acceptedPostId",
                table: "Posts",
                newName: "AcceptedPostId");

            migrationBuilder.AddColumn<int>(
                name: "PostId",
                table: "Comments",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Comments",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PostTags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PostId = table.Column<int>(nullable: false),
                    TagId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostTags", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostTags");

            migrationBuilder.DropColumn(
                name: "PostId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "AcceptedPostId",
                table: "Posts",
                newName: "acceptedPostId");

            migrationBuilder.AddColumn<DateTime>(
                name: "Timestamp",
                table: "Votes",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "Body", "ParentId", "Timestamp", "Title", "UserId", "acceptedPostId" },
                values: new object[,]
                {
                    { 1, "salut c'est cool", null, new DateTime(2019, 10, 3, 11, 11, 11, 0, DateTimeKind.Unspecified), "Essai", 1, null },
                    { 2, "salut c'est cool2", null, new DateTime(2018, 8, 21, 13, 11, 11, 0, DateTimeKind.Unspecified), "Essai2", 1, null },
                    { 3, "salut c'est cool3", 1, new DateTime(2018, 2, 26, 1, 24, 5, 0, DateTimeKind.Unspecified), null, 2, null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Email", "FirstName", "LastName", "Password", "Pseudo", "Reputation", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(1994, 11, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "nicolas.godfrin@live.be", "Nicolas", "Godfrin", "123", "Nico", 5, 0 },
                    { 2, new DateTime(1995, 9, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "raphCosta@hotmail.com", "Raphael", "Costa", "123", "Raph", 2, 0 },
                    { 3, new DateTime(1989, 3, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@hotmail.com", "admin", "admin", "admin", "admin", 5, 2 }
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
    }
}
