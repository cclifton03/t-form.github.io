CREATE proc [dbo].[Venues_Delete_ById]
				@Id int
as

/* TEST CODE -----------------
		
		Select*
		From dbo.Venues

		Declare @Id int = 11

		Execute dbo.Venues_Delete_ById @Id

		Select*
		From dbo.Venues
*/

BEGIN

		DELETE
		FROM dbo.Venues
		Where Id = @Id;

END
GO
