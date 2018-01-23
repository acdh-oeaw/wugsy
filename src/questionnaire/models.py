from django.db import models
from SPARQLWrapper import SPARQLWrapper, JSON

class Questionlist(models.Model):
    """This class represents the questionlist model."""
    subject = models.CharField(max_length=255, blank=True)
    predicate = models.CharField(max_length=255, blank=True)
    object = models.CharField(max_length=255, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "{}".format(self.subject, self.predicate, self.object)

class answers():
    def __str__(self):
        sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        sparql.setQuery("""
            # PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            # SELECT ?s ?label
            # WHERE { ?s rdfs:label ?label } limit 10
            select distinct ?s ?Concept
            where {?s a ?Concept} LIMIT 10
        """)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()

        for result in results["results"]["bindings"]:
            print(result["s"]["value"])
