# Setlist app
This is a hobby project for bands needing to browse pieces played by the band, transpose the chords of the pieces, and to create setlists of the pieces.

We aim at following functionality - grey ones have not yet been implemented.

Backend
* adding users
* login
* CRUD operations for pieces
<span style="color:grey">
* CRUD operations for bands
* CRUD operations for bands' setlists
* Adding and removing pieces to/from setlists
</span>

Frontend
* login
* sign up
* browsing pieces
<span style="color:grey">
* adding and deleting pieces
* modifying pieces
* transposing pieces
* adding bands and members to band
* adding and deleting setlists
* adding and removing pieces to/from setlists
</span>

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
* Label
* Chords
* Lyrics
