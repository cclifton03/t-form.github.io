CREATE proc [dbo].[VenueTypes_SelectAll]

as

/* Test Code
Execute dbo.VenueTypes_SelectAll
*/


BEGIN

		SELECT	[Id]
			,[Name]

		FROM [dbo].[VenueTypes]


END
GO
