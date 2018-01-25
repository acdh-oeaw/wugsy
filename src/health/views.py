from django.shortcuts import render
from django.views import generic

class HealthPage(generic.TemplateView):
    template_name = "health.html"
