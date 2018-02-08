# Game 00 Single Player

> Game may consist of several rounds with the same "board". Objective is to get links between a concept and words.
First round (or task): Player makes as much initial links between a concept and the displayed words as he can in a given time period (e.g. from marriage to apple).
Second round: Player makes "secondary links" between the words he picked and those on the board (e.g. from cake to pear)


## Points

Player gets points for:

## Procedure

### start of game
1. User enters the game
2. The game shows a screen with a start button
3. Game rules are displayed here (or we may make a tutorial?)
4. User presses start button when ready to play

### Playing field before player starts to interact

1. 25 cards with terms on them (=apple but not fruit)
( +-5 of these displayed cards contain “wrong” answers (e.g wood) to control the
 behavior of the user)
and
2. One concept card with one tradition (=Marriage);
3. Buttons: “Next” (Maybe text appears when hovering over it: “Press button/click to continue”); “Restart” (Maybe text appears when hovering over it: “Press to restart”)
4. Timer starts (e.g. 30 seconds)

### First round

>Basic idea of first round: Marriage (Tradition) gets linked to cake (food). These are the “initial links” - from the concept” (marriage) to cake (food). Users can pick as much food terms as they like until the time is over or until they do not find more links. Users are not allowed to make links between cards other than marriage and food terms (cake)

1. The user can do 2 different things:
a. User picks food terms which are connected to the tradition displayed on the concept card.
    OR
b. User clicks on “restart” because he/she is not able to find any links → a new set of cards appear (the tradition/concept card stays the same)
2. if a. → selected food terms cards change the colour
                   → “links” between the tradition and the food terms appear automatically
       → by clicking on the same card twice users can deselect this card
3. User repeats this process until:
time runs out
    OR
he is not able to find new links and presses “next/continue” button

### Pre Screen before second round

1. User sees a “start next round” screen (like at the beginning of the game)
2. new rules are displayed here
3. maybe some statistics already here (e.g. 95% Users connected marriage with cake; only 5 % marriage with Rice)

### second round

>Basic idea of second round: Now “Cake” gets linked to “flour”, which means that this round is “term to term” and no longer “concept to term”. Users are not allowed to link from concept card any longer. Instead they can select one of their previous food terms and link them to other food terms on the field. As a result we might have something looking like “mind trees”

1. User presses start
2. Timer starts again (this time user may have more time than in the first round)
3. No “restart” button in this round; “next” button is renamed in “end game”
4. User sees the same cards like in the first round
a. concept card (marriage) may be grey in this round
b. Cards user picked before are still coloured
5. User selects one of his first round food terms
a. gets a frame or something when it is picked
6. User clicks on second food term on the field
7. Automatically links between the two words
a. linked terms may change the colour or something
b. links can be “destroyed” by clicking a second time on the card
8. User may do that for one or more words
9. User repeats this process until:
a. time runs out
    OR
b. he is not able to find new links and presses “end game” button

### final screen
1. New screen appears
2. User may see some statistics after this round ( points, results compared to other users etc.); congratulations whatever
And
3. The "mind"tree": “mind tree” or “memory path” can be a visualisation of individual players results. The more players play the bigger/wider the tree or path gets to show trends in what gets associated a lot and/or hardly every across players.

> results of players may be compared and players get asked on differing answers (methodology?)

## Data returned after game is played:

1. `time_remaining`
2. Test
