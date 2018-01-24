from rest_framework import generics
from .serializers import QuestionlistSerializer
from .models import Questionlist
from SPARQLWrapper import SPARQLWrapper, JSON
from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

class QuestionnairePage(generic.TemplateView):
    template_name = "questionnaire.html"

class CreateView(generics.ListCreateAPIView):

    """This class defines the create behavior of our rest api."""
    template_name = "questionnaire.html"
    queryset = Questionlist.objects.all()
    serializer_class = QuestionlistSerializer

    def perform_create(self, serializer):
        """Save the post data when creating a new bucketlist."""
        serializer.save()
class DetailsView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    template_name = "questionnaire.html"

    queryset = Questionlist.objects.all()
    serializer_class = QuestionlistSerializer

class QuestView(APIView):
    def get(self, request):
        sparql = SPARQLWrapper("http://fuseki:3030/Questionnaire/query")
        sparql.setQuery("""
                     # PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                     # SELECT ?s ?label
                            # WHERE { ?s rdfs:label ?label } limit 10

                    select distinct ?subject ?predicate ?object
                    where {?subject ?predicate ?object} LIMIT 10
                 """)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return Response(results)