# Setlist app

This is a hobby project for bands needing to browse pieces played by the band, transpose the chords of the pieces, and to create setlists of the pieces.

Since bands tend to train and play gigs in some shady cellars with no internet connectivity, the application should work in "offline mode", too. This means that we load the pieces and setlists to browser somewhere where there is connectivity, and can then use these without connectivity.

We aim at following functionality - ones in parentheses have not yet been implemented.

Backend

- adding bands
- login
- password reset
- CRUD operations for pieces
- transposing pieces
- CRUD operations for bands
- CRUD operations for bands' setlists
- Adding and removing pieces to/from setlists
- Moving pieces up/down in setlists

Frontend

- login
- browsing pieces
- adding and deleting pieces
- modifying pieces
- transposing pieces
- sign up / adding a band
- resettting band password
- adding and deleting setlists
- adding and removing pieces to/from setlists
- "playing" pieces with desired speed based on piece length
- (ensure that view is changed if another band member changes view, such as selects next piece in setlist)

It is assumed that pieces are represented in text files in the following style:

```
Knockin On Heavens Door chords by Bob Dylan
[Intro]
G D Am
G D C

[Verse]
G              D            Am
Mama take this badge off of me
G       D         C
I can't use it anymore
G            D                        Am
It's getting dark, too dark to see
G          D                   C
I feel I'm knockin on heaven's door

[Chorus]
G             D                    Am
Knock, knock, knockin' on heaven's door
G             D                    C
Knock, knock, knockin' on heaven's door
G             D                    Am
Knock, knock, knockin' on heaven's door
G             D                    C
Knock, knock, knockin' on heaven's door
```

The data model of the application separates three different kinds of "rows" in pieces:

- Label
- Chords
- Lyrics
