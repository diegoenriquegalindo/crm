from django.shortcuts import render_to_response

# Create your views here.
def home_view(request):
    return render_to_response("index.html",{})
