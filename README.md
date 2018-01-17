# ACDH language game app

> This repo hosts a web app that gives language games to users, and returns their solutions to a database.

Key specs:

* Python 3
* Django
* MySQL
* Docker
* CI and unittests
* Zenodo

## Quickstart

To run/develop *wugsy* locally, first, make sure you have Docker installed, and the Docker daemon running. Then, clone the repo, `cd` into it, make a local settings file, and use the provided script to launch:

```bash
git clone https://github.com/acdh-oeaw/wugsy
cd wugsy
cp src/wugsy/settings/local.sample.env src/wugsy/settings/local.env
sh ./start.sh
```

Then, point your web browser to `http:/localhost:8000/`.

### Running without Docker

Docker is the preferred way to do development, because we can all be more certain that we are running code in the same environment. It also simplifies deployment a log.

But, if you don't have or want to use Docker, there is still hope. If this is you, please work from within a Python 3 [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/). Then, do something like:

```bash
git clone https://github.com/acdh-oeaw/wugsy
cd wugsy
cp src/wugsy/settings/local.sample.env src/wugsy/settings/local.env
pip install -r requirements.txt
python src/manage.py makemigrations
python src/manage.py migrate
python src/manage.py runserver
```

Then, point your web browser to `http://127.0.0.1:8000/`.

## Quick overview of the system

1. Users can login, which stores profile data to a database
2. Users request a game from the backend
3. Backend uses their profile data, a language database and existing responses to produce the data needed for a new game
4. Backend sends this data to frontend as JSON
5. Frontend uses the JSON data to make a nice game for the user
6. User plays game and reaches the end
7. Game data is send back to the backend
8. Backend stores result and produces a new game (etc.)

## The JSON

To make collaboration between backend and frontend devs easier, we use JSON to exchange data. To aid this process, we have some schemata that describe how the JSON should be structured. Information about these schemata can be found in `schemata/schemata.md`.

The backend -> frontend format, which gives the frontend everything needed to set the look and behaviour of the game board, is provided in `schemata/new-game.json`.

The frontend -> backend format, used to communicate game results, is provided in `schemata/end-game.json`.

Python code for validating JSON is in `src/wugsy/validate.py`.

## Rules

For each game type, there should be an associated rule list described in `rules/`. For `game00`, for example, in `rules/game00.md` we may find:

```text
* TITLE: "Describe the concept to your opponent without using any of the displayed words"
* CARDS: each card shows text, can be deleted, but not selected
* TIMER: countdown from 30 seconds
* ENDING: when the user hits hits the 'Done' button

... etc.
```

Backend developers will use the game rules to write code that extracts useful data from the database, and to store game results in a different database. Frontend developers will formulate each game as a class or method that can be applied to the game board in order to turn various functionalities on or off, to populate text fields, and so on.

## Frontend

The frontend receives JSON that can be used to start the right game, display the user's score and opponent, and populate the various fields with words and so on. All games share a fairly similar board, though game boards may not be identical. The board will contain:

- A game title
- Grid of cards, which will display a word or two (2x2, 3x3, 4x4, 5x5 and 6x6 possible)
- A space beneath that will display a concept linking these words, or request one from the player
- A text entry field, also below the cards, where a user can describe a concept
- A countdown timer
- A current score
- A space that visualises an opponent when there is one (username, picture, score)
- A button that can be pushed to mark a game as bad, which may provide a request for more information

For example, for the sample data in `schemata/new-game.json`, the frontend would generate a 2x2 grid, with board functionality determined by code that implements `rules/game00.md`.

### How to add games to the frontend: one solution

For a hypothetical `game03`:

1. Open `src/static/site/js/game.js`
2. Create object representations of the various elements of the board in `BaseGame` (only needs to be done once)
3. Add a new function named `Game03` that takes one argument, the JSON from the backend.
4. Fill out this function to comply with the rules in `rules/game03.md`
5. Ensure that the game is placed in the HTML once generated (`src/templates/game.html`).
6. Ensure that on game end, JSON is POSTed via AJAX to `/game_result` that conforms to `schemata/end-game.json`
7. Add this game to the `games` map so that it will be automatically found

The game should be aesthetically pleasing, minimalistic and clean. Animations, transitions etc. are not required for the prototype, but should be included later.

### Collaboration

Project is open source and anybody can contribute. Please use issue tracking. Create branches for each issue and submit PRs.
