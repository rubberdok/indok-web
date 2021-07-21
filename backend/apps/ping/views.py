from django.http import JsonResponse


def ping(_):
    return JsonResponse(
        {
            "message": "Yoinks!",
            "status": "success",
            "platform": "Fargate",
        }
    )
