﻿CREATE proc [dbo].[Venues_SearchByName_Pagination]
					@PageIndex int
					,@PageSize int
					,@Query nvarchar(255)
					
as


/* TEST CODE -----------------------------------------------

		Declare
				@PageIndex int = 0
				,@PageSize int = 8
				,@Query nvarchar(255) = 'jared'

		Execute dbo.Venues_SearchByName_Pagination
				@PageIndex
				,@PageSize
				,@Query

				select*
				from dbo.Users

*/

BEGIN

		Declare @offset int = @PageIndex * @PageSize

		SELECT V.[Id]
			  ,V.[Name]
			  ,V.[Description]

			  ,(select L.Id
						,L.LineOne
						,L.LineTwo
						,L.City
						,L.Zip
						,S.Id as StateId
						,S.[Name] as [State]
				From dbo.Locations as L
				Where L.Id = V.LocationId
				 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as LocationInfo

			  ,VT.Id as VenueTypeId
			  ,VT.[Name] as VenueType
			  ,F.[Url] as FileImageUrl
			  ,V.[Url]
			  ,dbo.fn_GetUserJSON(V.Createdby) as CreatedBy
			  ,dbo.fn_GetUserJSON(V.ModifiedBy) as ModifiedBy
			  ,V.[DateCreated]
			  ,V.[DateModified]
			  ,TotalCount = COUNT(1) OVER()
		FROM [dbo].[Venues] as V
		inner join dbo.VenueTypes as VT
		on V.VenueTypeId= VT.Id
		inner join dbo.Files as F
		on V.FileId = F.Id
		inner join dbo.Locations as L
		on L.Id = V.LocationId
		inner join dbo.States as S
		on S.Id = L.StateId
		inner join dbo.Users as U
		on  U.Id = V.Createdby

		WHERE (U.FirstName LIKE '%' + @Query + '%' OR U.LastName LIKE '%' + @Query + '%')

		ORDER BY V.Id
		OFFSET @offSet Rows
		FETCH NEXT @PageSize Rows ONLY

END
GO
