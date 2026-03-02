using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyGamingListAPI.Migrations
{
    /// <inheritdoc />
    public partial class AdicionacolunaIsFavoriteemUserGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExternalID",
                table: "Games",
                newName: "ExternalId");

            migrationBuilder.RenameIndex(
                name: "IX_Games_ExternalID",
                table: "Games",
                newName: "IX_Games_ExternalId");

            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "UserGames",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "UserGames");

            migrationBuilder.RenameColumn(
                name: "ExternalId",
                table: "Games",
                newName: "ExternalID");

            migrationBuilder.RenameIndex(
                name: "IX_Games_ExternalId",
                table: "Games",
                newName: "IX_Games_ExternalID");
        }
    }
}
