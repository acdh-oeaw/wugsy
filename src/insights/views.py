from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

# Create your views here.
class InsightPage(generic.TemplateView):
    template_name = "insights.html"

@api_view(['POST'])
def get_insight(request):
    """
    Frontend will request a game from here, posting session/user data.

    We use this data to generate JSON suitable for a game and then return it
    """
    given_data = request.data
    user = request.user
    return JsonResponse({'expected': 'insight'})


@api_view(['POST'])
def return_data(request):
    """
    Save game result to database, and either provide new game or redirect
    """
    given_data = request.data
    user = request.user
    return JsonResponse({'expected': 'insight'})
