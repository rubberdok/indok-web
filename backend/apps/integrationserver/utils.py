from django.contrib.auth import get_user_model

User = get_user_model()

USERS = [
    {
        "username": "eva_student",
        "first_name": "Eva",
        "last_name": "Student Åsen",
        "email": "eva_student@feide.no",
        "is_active": True,
        "feide_userid": "557669b3-af64-4a55-b97e-57c0836efef6",
        "feide_email": "eva_student@feide.no",
        "graduation_year": 2025,
        "is_indok": True,
        "first_login": False,
        "phone_number": "40000000",
    },
    {
        "username": "asbjorn_evelg",
        "first_name": "Asbjørn",
        "last_name": "ElevG Hansen",
        "email": "noreply@feide.no",
        "feide_userid": "af761fdb-71fa-484b-9782-ababdc739559",
        "feide_email": "noreply@feide.no",
        "first_login": False,
        "graduation_year": 2025,
        "is_active": True,
        "is_indok": True,
        "phone_number": "40000000",
    },
]


class UserFactories:
    def __init__(self) -> None:
        print("Loading users...")
        for user in USERS:
            User.objects.get_or_create(
                username=user["username"],
                first_name=user["first_name"],
                last_name=user["last_name"],
                email=user["email"],
                is_active=user["is_active"],
                feide_userid=user["feide_userid"],
                feide_email=user["feide_email"],
                graduation_year=user["graduation_year"],
                is_indok=user["is_indok"],
                first_login=user["first_login"],
                phone_number=user["phone_number"],
            )
        print(f"Successfully loaded {User.objects.all().count()} users")
