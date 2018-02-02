from django.shortcuts import render
from django.views import generic

class VisualPage(generic.TemplateView):
    template_name = "visual.html"
