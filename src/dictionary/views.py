from django.shortcuts import render
from django.views import generic

class DictionaryPage(generic.TemplateView):
    template_name = "dictionary.html"
