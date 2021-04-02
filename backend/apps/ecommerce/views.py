from rest_framework.views import APIView


class VippsCallback(APIView):
    def post(self, request):
        print(request.json())
