from django.contrib.auth import get_user_model
from utils.testing.factories.users import IndokUserFactory, UserFactory


class UserFactories:
    def __init__(self) -> None:
        print("Loading users...")
        IndokUserFactory(
            username="eva_student",
            first_name="Eva",
            last_name="Student Åsen",
            email="eva_student@feide.no",
            is_active=True,
            feide_userid="cypress_user",
            feide_email="eva_student@feide.no",
            graduation_year=2025,
            is_indok=True,
            first_login=False,
        )
        UserFactory(
            username="asbjorn_elevg",
            first_name="Asbjørn",
            last_name="ElevG Hansen",
            email="noreply@feide.no",
            feide_userid="55de7d71-4a25-4103-8e43-35df8c2d472a",
            feide_email="noreply@feide.no",
            first_login=False,
            graduation_year=2025,
        )
        print(f"Successfully loaded {get_user_model().objects.all().count()} users")
