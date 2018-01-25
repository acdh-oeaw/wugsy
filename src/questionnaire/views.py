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

class QuestionnaireView(APIView):
    def get(self, request):
        sparql = SPARQLWrapper("http://fuseki:3030/Questionnaire/query")
        sparql.setQuery("""

                    SELECT *
                    From named <http://localhost/questionnaires>
                    WHERE {
                    Graph <http://localhost/questionnaires> {?s ?p ?o}
                    } Limit 50
                 """)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return Response(results)
class QuestionView(APIView):
    def get(self, request):
        sparql = SPARQLWrapper("http://fuseki:3030/Questionnaire/query")
        sparql.setQuery("""

                    SELECT *
                    From named <http://localhost/questions>
                    WHERE {
                    Graph <http://localhost/questions> {?s ?p ?o}
                    } Limit 50
                 """)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return Response(results)

class DetailedQuestionnaireView(APIView):
    def get(self, request,pk):
        #the query will strip the questionnaire number and replace http://localhost/oldca/fragebogen/1 in the query
        subj = "<http://localhost/oldca/fragebogen/" + pk + ">"
        sparql = SPARQLWrapper("http://fuseki:3030/Questionnaire/query")
        sparql.setQuery("""

                        SELECT *
                        From named <http://localhost/questionnaires>
                        WHERE {
                        Graph <http://localhost/questionnaires> {""" +subj + """ ?p ?o}
                        } Limit 50
                     """)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return Response(results)

class DetailedQuestionView(APIView):
    def get(self, request,pk):
        # the query will strip the questionnaire number and replace http://localhost/oldca/fragebogen/1 in the query
        subj="<http://localhost/oldca/frage/" +pk +">"
        sparql = SPARQLWrapper("http://fuseki:3030/Questionnaire/query")
        sparql.setQuery("""

                        SELECT *
                        From named <http://localhost/questions>
                        WHERE {
                        Graph <http://localhost/questions> {""" +subj + """ ?p ?o}
                        } Limit 50
                     """)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return Response(results)