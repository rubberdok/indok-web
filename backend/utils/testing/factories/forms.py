from factory.django import DjangoModelFactory
import factory, factory.django
from faker import Faker
from apps.forms.models import Form, Question, Option, Answer, Response
from utils.testing.factories.organizations import OrganizationFactory
from utils.testing.factories.users import UserFactory

fake: Faker = Faker(["no-NO"])


class FormFactory(DjangoModelFactory):
    class Meta:
        model = Form

    name = fake.company()
    description = fake.catch_phrase()
    organization = factory.SubFactory(OrganizationFactory)


class QuestionFactory(DjangoModelFactory):
    class Meta:
        model = Question

    description = fake.catch_phrase()
    form = factory.SubFactory(FormFactory)
    question = fake.bs()
    question_type = "PARAGRAPH"


class OptionFactory(DjangoModelFactory):
    class Meta:
        model = Option

    answer = fake.catch_phrase()
    question = factory.SubFactory(QuestionFactory)


class ResponseFactory(DjangoModelFactory):
    class Meta:
        model = Response

    form = factory.SubFactory(FormFactory)
    respondent = factory.SubFactory(UserFactory)


class AnswerFactory(DjangoModelFactory):
    class Meta:
        model = Answer

    answer = fake.catch_phrase()
    response = factory.SubFactory(ResponseFactory)
    question = factory.SubFactory(QuestionFactory)
