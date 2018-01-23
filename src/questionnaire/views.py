from rest_framework import generics
from .serializers import QuestionlistSerializer
from .models import Questionlist
from .models import answers
from SPARQLWrapper import SPARQLWrapper, JSON
from django.http import HttpResponseRedirect, HttpResponse
from django.template import loader
import requests


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

def quest(request):
    sparql = SPARQLWrapper("http://localhost:3030/Qeustionnaire/query")
    sparql.setQuery("""
        # PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        # SELECT ?s ?label
        # WHERE { ?s rdfs:label ?label } limit 10
        select distinct ?subject ?predicate ?object
        where {?subject ?predicate ?object} LIMIT 10
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    #print(results)
    #for result in results["results"]["bindings"]:
        #print(result["subject"]["value"], "\t", result["predicate"]["value"], "\t",result["object"]["value"])



    template = loader.get_template('questions/quests.html')
    context = {'result': results,
               }

    return HttpResponse(template.render(context, request))
