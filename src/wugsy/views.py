from django.views import generic

class HomePage(generic.TemplateView):
    template_name = "home.html"

class AboutPage(generic.TemplateView):
    template_name = "about.html"

class TourPage(generic.TemplateView):
    template_name = "tour.html"

class UsersPage(generic.TemplateView):
    template_name = "user.html"

class AdminPage(generic.TemplateView):
    template_name = "admin.html"

class AccountPage(generic.TemplateView):
    template_name = "account.html"
