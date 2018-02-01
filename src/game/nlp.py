"""
Main NLP methods for processing input data. Image captions/metadata from topothek
"""

spacy_data = dict(en='en_core_web_lg', de='de')

import os
import spacy
from spacy.tokens import Token
import nltk
from nltk.corpus import wordnet
from nltk.stem.wordnet import WordNetLemmatizer
from collections import defaultdict, OrderedDict
import nltk
from nltk.collocations import BigramCollocationFinder
from spacy.tokens import Doc

class Analyser(object):

    def __init__(self, language='en', reference=None): # 'default.txt'
        self.sample = None
        self.lang = language
        self.reference = reference
        self.vector_model = self.get_vector_model(self.reference)
        self.spacy_model = spacy_data.get(self.lang, self.reference)
        self.spacy_model = spacy.load(self.spacy_model)
        self.wordnet = wordnet
        self.original_text = None
        self._insights = defaultdict(list)
        self.name_func = dict(hypernyms=self.get_hypernyms,
                              sentiment=self.sentiment,
                              hyponyms=self.get_hyponyms,
                              synonyms=self.get_synonyms,
                              collocates=self.get_collocates,
                              most_similar=self.most_similar)

    def parse(self, sample):
        self.original_text = sample
        #if not isinstance(sample, LanguageSample):
        #    sample = LanguageSample(sample)
        #self.sample = sample
        self.doc = self.spacy_model(sample)
        return self.doc

    def get_vector_model(self, ref):
        if not ref:
            return
        if not os.path.exists(ref):
            return spacy.load(ref) if isinstance(ref, str) else ref

        files = list()
        concat = list()
        if os.path.isfile(ref):
            files.append(ref)
        if os.path.isdir(ref):
            for root, dirs, names in os.walk(ref):
                for name in names:
                    fname = os.path.join(root, name)
                    files.append(fname)
        for fname in files:
            with open(fname, 'r') as fo:
                concat.append(fo.read())
        return '\n'.join(concat)

    def insights(self, parsed=None):
        self.doc = parsed if parsed is not None else self.doc
        if not self.doc:
            raise NotImplementedError('Need to parse parsed')
        insight_entry = str(self.original_text)
        for token in self.doc:
            print('TOKEN', token)
            analysis = self.analyse_token(token)
            print('ANALYSIS', analysis)
            self._insights[insight_entry].append(analysis)
            self._insights[insight_entry].append(token)
        self._insights[insight_entry].append(self.doc.print_tree)
        return self._insights[insight_entry]

    def analyse_token(self, token):
        analysis = dict()
        print(token.pos_.lower())
        is_open_class = token.pos_.lower() in 'njvr'
        if is_open_class:
            for name, method in self.name_func.items():
                print('run', name)
                component = method(token)
                analysis[name] = component
        #supertoken = SuperToken(token, analysis)
        return analysis

    def sentiment(self, token):
        return token.sentiment

    def most_similar(self, word):
        return
        queries = [w for w in word.vocab if w.is_lower == word.is_lower and w.prob >= -15]
        by_similarity = sorted(queries, key=lambda w: word.similarity(w), reverse=True)
        return [w.lower_ for w in self.most_similar(self.spacy_model.vocab[word])]
        #return by_similarity[:10]

    def get_hypernyms(self, token):
        formatted = '{}.{}.1'.format(token.lemma_, token.pos_)
        hyps = self.wordnet.synset(formatted)[0].hypernyms()
        answers = set()
        for hyp in hyps:
            for lem in hyp.lemmas():
                answers.add(str(lem))
        return list(answers)

    def get_hyponyms(self, token):
        formatted = '{}.{}.1'.format(token.lemma_, token.pos_)
        hyps = self.wordnet.synset(formatted)[0].hyponyms()
        answers = set()
        for hyp in hyps:
            for lem in hyp.lemmas():
                answers.add(str(lem))
        return list(answers)

    def get_synonyms(self, token):
        formatted = '{}.{}.1'.format(token.lemma_, token.pos_)
        syns = self.wordnet.synsets(token)
        answers = set()
        for syn in syns:
            for name in ss.lemma_names():
                answers.add(name)
        return list(answers)

    def get_collocates(self, token):
        bigram_measures = nltk.collocations.BigramAssocMeasures()
        trigram_measures = nltk.collocations.TrigramAssocMeasures()
        finder = BigramCollocationFinder.from_words(
        nltk.corpus.genesis.words('english-web.txt'))
        finder.apply_freq_filter(3)
        bigrams = finder.nbest(bigram_measures.pmi, 100000)
        return [list(b).remove(token.lemma_)[0] for b in bigrams if token.lemma_ in b]

# unused till we can figure it out
class SuperToken(Token):

    def __init__(self, token):
        super().__init__(token.vocab)
        return
        #raise ValueError([self, token.vocab, token.doc, int(token.offset)])
        if not analysis:
            analysis = None
        self._analysis = analysis
        for attr, value in analysis.items():
            if hasattr(self, attr):
                raise ValueError('object already has {}'.format(attr))
            setattr(self, attr, value)

class LanguageSample(object):

    def __init__(self, sample):
        assert isinstance(sample, str)
        self.sample = sample


if __name__ == '__main__':

    analyser = Analyser('en')
    analyser.parse('This is an example sentence.')
    print(analyser.insights())
    analyser.parse('A child playing with a beachball in the snow')
    print(analyser.insights())
