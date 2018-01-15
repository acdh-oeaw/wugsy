# validation scheme for frontend request for game data
REQUESTED = dict(
                 game_type=int,
                 time_remaining=float,
                 user_id=int,
                 opponent_id=int,
                 concept_space_text=str,
                 bad_game_selected=bool,
                 bad_game_feedback=dict(rating=int,
                                        reason=str),
                selected_cards=[int],
                deleted_cards=[int],
                card_order=[int]
                )

# validation scheme for backend-generated game
PROVIDED = dict(
                game_type=int,
                game_title=str,
                opponent=dict(id=int,
                              username=str,
                              score=int,
                              picture=str),
                cards=[dict(id=int,
                            colour=str,
                            card_text=str,
                            reverse=None,
                            selected=bool,
                            in_theme=bool)],
                concept_space=dict(concept_text=str,
                                   colour=str,
                                   hover_text=str),
                user_text_entry_field=dict(placeholder=str),
                user_info=dict(id=int,
                               username=str,
                               score=int,
                               picture=str),
                extra=None
                )

def _validator(data_to_check, schema):
    """
    Check that data_to_check conforms to types in schema
    """
    assert isinstance(data_to_check, dict), 'Data must be dict'
    for field, expected_type in schema.items():
        if expected_type is None:
            continue
        found = data_to_check.get(field)
        msg = '{} {} is not type {}'.format(field, found, expected_type)
        if isinstance(expected_type, type):
            assert isinstance(found, expected_type), msg
        else:
            assert isinstance(found, type(expected_type)), msg
        if isinstance(expected_type, dict):
            #msg = '{} {} {} assertion fail'.format(expected_type, found, field)
            assert _validator(found, expected_type), msg
        elif isinstance(expected_type, list):
            subschema = expected_type[0]
            for item in found:
                if isinstance(subschema, dict):
                    assert _validator(item, subschema)
                elif isinstance(subschema, type):
                    assert isinstance(item, subschema)
                else:
                    raise ValueError('List item must be dict or type')
    return True
