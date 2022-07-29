# Migration from MongoDB to DynamoDB

As a part of migration of the app to AWS, the database was transitioned from MongoDB to DynamoDB. Yes, it would have been possible to continue using MongoDB in AWS, too, but I did this for learning's sake.

In the process, Mongoose was replaced with Dynamoose. This caused some changes in both application code and tests, but was not overly complicated. At this stage, the original three-collection/table solution was left intact.

In the next step, the database was migrated from three-table solution (Bands, Setlists and Pieces) to DynamoDB recommended one-table solution (table BandSetlists). The process I used is well described [in this article](https://www.trek10.com/blog/dynamodb-single-table-relational-modeling).

Since the application was already quite stable, we knew the data access patterns needed:

- Band by name
- Piece id
- Setlist id
- Pieces of a Band by name in alphabetical order
- Setlists of a Band by name in alphabetical order
- Pieces of a Setlist with Piece names and Piece artists, ordered by setlist order

Base table attributes:

- pk
- sk
  -- Band data: "BAND"
  -- Piece data: "PIECE"
  -- Setlist data: "SETLIST"
  -- Band name + Piece id
  -- Band name + Setlist id
  -- Setlist id + Piece id
- data (GSI sk)
  -- Setlist id + Piece id => settlist order
- name
- passwordHash
- securityQuestion
- securityAnswerHash
- title
- artist
- duration
- delay
- pages
- notes

GSI1:
