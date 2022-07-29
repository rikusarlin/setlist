# Migration from MongoDB to DynamoDB

As a part of migration of the app to AWS, the database was transitioned from MongoDB to DynamoDB. Yes, it would have been possible to continue using MongoDB in AWS, too, but I did this for learning's sake.

In the process, Mongoose was replaced with Dynamoose. This caused some changes in both application code and tests, but was not overly complicated. At this stage, the original three-collection/table solution was left intact.

In the next step, the database was migrated from three-table solution (Bands, Setlists and Pieces) to DynamoDB recommended one-table solution (table BandSetlist). The process I used is well described [in this article](https://www.trek10.com/blog/dynamodb-single-table-relational-modeling).

Since the application was already quite stable, we knew the data access patterns needed:

- Band by name
- Piece id
- Setlist id
- Pieces of a Band by name in alphabetical order
- Setlists of a Band by name in alphabetical order
- Pieces of a Setlist with Piece names and Piece artists, ordered by setlist order

Base table attributes:

- pk (in GSI, too)
- sk (GSI pk)
  -- Band entity: "BAND"
  -- Piece entity: "PIECE"
  -- Setlist entity: "SETLIST"
  -- Band-Piece relation: "BAND-bandId", pk = "PIECE-pieceId"
  -- Band-Setlist relation: "BAND-bandId", sk = "SETLIST-setlistId"
  -- Setlist-Piece relation: "PIECE-pieceId", sk = "SETLIST-setlistId"
- data (GSI sk)
  -- Piece-Band relation: "BAND-bandId", sk = "PIECE-pieceId"
  -- Setlist-Band relation: "BAND-bandId", sk = "SETLIST-setlistId"
  -- Piece-Setlist relation: "SETLIST-setlistId", sk = "PIECE-pieceId"
- id is the "plain" id in all entity rows (in GSI, too)
- name
- passwordHash
- securityQuestion
- securityAnswerHash
- title (in GSI, too)
- artist (in GSI, too)
- duration
- delay
- pages
- notes
- setlistName (in GSI, too)
- indexInSetlist (in GSI, too)

GSI allows us to query, for example all setlists of a given band (sk='SETLIST', data='BAND-bandId').

Pieces of a given setlist can be queried directly from the main index, when setlist id is known (pk='SETLIST-setlistId', sk=beginsWith('PIECE-')). You could also query GSI with sk=beginsWith('PIECE') and data='SETLIST-setlistId') to get only the piece data in GSI (which is actually sufficient).

If you query the main index with only pk='SETLIST-setlistId', you'll get ALL data related to that setlist - entity data, setlist-band relation and setlist-piece relations!
