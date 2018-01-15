## JSON format for games

It's important that we agree on JSON formats at two points:

1. The data given to the frontend that can be used to display a game correctly
2. The data returned to the backend at the end of a game

The schemata might eventually be expanded, but the general structure should remain constant to aid the separate development groups.

Values of `null` indicate places where there may eventually be more data, but where right now it's not important. For some games, some parts are not required. These fields can also be given `null`.

```text
cards (array of maps):
  id (int): unique id for card
  colour (hex): hex colour string for card
  text (str): main text on the card
  reverse (map): currently none, to be expanded for new games
  in_theme (bool): probably hidden field, used to group cards into good/bad
concept_space (map):
  text (str): text to show as concept
  colour (hex): colour for this box
  hover (str): text to show on hover over
extra (map): currently null, but something will end up here
game_title (str): title/description of the game for players
game_type (int): identifier for the ruleset to be used
opponent (map):
  username (str): chosen username
  gender (str): m/f/other
  score (int): how many points the user currently has
  picture (str): path to profile picture
user_info (map):
  username (str): chosen username
  score (int): current points
  picture (str): path to profile picture
user_text_entry_field (map):
  placeholder (str): what the text field should say before user enters anything
```


## Data returned to backend

When a game is over, pretty much any useful information needs to be returned. Format to be decided.
