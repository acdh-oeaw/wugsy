from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

class StoryPage(generic.TemplateView):
    template_name = "stories.html"

@api_view(['POST'])
def get_story(request):
    return JsonResponse("Once upon a time...")

@api_view(['POST'])
def story_reaction(request):
    return JsonResponse("Thanks for rating")
