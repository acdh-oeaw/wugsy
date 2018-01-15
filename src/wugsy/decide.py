import random

# just some data to test the system
CARDS = ['apple',
         'Banana',
         'pear',
         'orange',
         'a very long card that needs to look ok',
         'card\twith\ttabs',
         'ALL CAPS',
         'automob ile']

class DecideGame(object):
    """
    Class that generates a game from a request

    Right now it just gives dummy data, but can be filled in with methods
    that look things up in DB and decide
    """

    def __init__(self, request, user):
        self.request = request
        self.user = user
        self._nonce = random.randint(0, 10000)
        self._type = self._get_type()
        self._title = self._get_title()
        self._opponent = self._get_opponent()
        self._cards = self._get_cards()
        self._concept_space = self._get_concept_space()
        self._user_text_entry_field = self._get_user_text_entry_field()
        self._user_info = self._get_user_info()
        self._extra = self._get_extra()

    def _get_type(self):
        return 0

    def _get_title(self):
        return 'Prototype game {} for {}'.format(self._nonce, self.user.name)

    def _get_opponent(self):
        return dict(id=78,
                    username='fake-opponent',
                    score=1234,
                    picture='img.jpg')

    def _get_cards(self):
        out = list()
        cards_for_games = {0: 25}
        for i in range(0, cards_for_games.get(self._type, 16)):
            out.append(dict(id=i,
                            colour='#ffffff',
                            card_text='dummy {}'.format(random.choice(CARDS)),
                            reverse=None,
                            selected=random.choice([True, False]),
                            in_theme=random.choice([True, False])
                            ))
        return out

    def _get_concept_space(self):
        return dict(concept_text='Underlying concept',
                    colour='#0000ff',
                    hover_text='hovering')

    def _get_user_text_entry_field(self):
        return dict(placeholder='placeholder text here')

    def _get_user_info(self):
        return dict(id=321,
                    username='developer',
                    score=1246,
                    picture='img.jpg')

    def _get_extra(self):
        return None

    def to_dict(self):
        return dict(game_type=self._type,
                    game_title=self._title,
                    opponent=self._opponent,
                    cards=self._cards,
                    concept_space=self._concept_space,
                    user_text_entry_field=self._user_text_entry_field,
                    user_info=self._user_info,
                    extra=self._extra
                    )
