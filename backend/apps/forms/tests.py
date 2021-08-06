import json
from typing import Any, Optional

from django.contrib.auth import get_user_model
from guardian.shortcuts import assign_perm
from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.factories.forms import (
    AnswerFactory,
    FormFactory,
    OptionFactory,
    QuestionFactory,
    ResponseFactory,
)
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory

from apps.forms.models import Form, Question


class FormBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()

        # Create users and an organization
        self.authorized_user = UserFactory()
        self.unauthorized_user = UserFactory()
        self.preexisting_user = UserFactory()
        self.organization = OrganizationFactory()
        MembershipFactory(user=self.authorized_user, organization=self.organization)

        # Create the form
        self.form = FormFactory(organization=self.organization)

        # Assign permissions
        # TODO: Replace these with signals and groups
        assign_perm("forms.view_form", self.authorized_user)
        assign_perm("forms.add_form", self.authorized_user)
        assign_perm("forms.change_form", self.authorized_user, self.form)
        assign_perm("forms.delete_form", self.authorized_user, self.form)
        assign_perm(
            "forms.manage_form",
            get_user_model().objects.get(pk=self.authorized_user.pk),
            self.form,
        )

        assign_perm("forms.view_form", self.unauthorized_user)
        assign_perm("forms.add_answer", self.unauthorized_user)
        assign_perm("forms.change_answer", self.unauthorized_user)

        # Create some questions
        self.paragraph = QuestionFactory(form=self.form)
        self.not_mandatory = QuestionFactory(form=self.form, mandatory=False)
        self.short_question = QuestionFactory(
            form=self.form, question_type="SHORT_ANSWER"
        )
        self.mcq = QuestionFactory(form=self.form, question_type="MULTIPLE_CHOICE")
        self.checkboxes = QuestionFactory(form=self.form, question_type="CHECKBOXES")
        self.dropdown = QuestionFactory(form=self.form, question_type="DROPDOWN")

        # Create some options for MCQs
        self.op1 = OptionFactory(question=self.mcq)
        self.op2 = OptionFactory(question=self.mcq)
        self.op3 = OptionFactory(question=self.checkboxes)
        self.op4 = OptionFactory(question=self.checkboxes)
        self.op5 = OptionFactory(question=self.dropdown)
        self.op6 = OptionFactory(question=self.dropdown)

        # Populate with some preexisting answers
        self.response = ResponseFactory(respondent=self.preexisting_user)
        self.answer = AnswerFactory(question=self.paragraph, response=self.response)
        self.answer = AnswerFactory(
            question=self.short_question, response=self.response
        )
        self.answer = AnswerFactory(question=self.mcq, response=self.response)
        self.answer = AnswerFactory(question=self.checkboxes, response=self.response)
        self.answer = AnswerFactory(question=self.dropdown, response=self.response)

        self.DESCRIPTION = "description"
        self.NAME = "test"
        self.CREATE_MUTATION = f"""
            mutation {{
                createForm(formData: {{
                    name: "{self.NAME}"
                    description: "{self.DESCRIPTION}"
                    organizationId: {self.organization.id}
                }}) {{
                    ok
                    form {{
                        id
                        name
                        description
                        organization {{
                            id
                        }}
                    }}
                }}
            }}
        """

        self.UPDATE_MUTATION = f"""
            mutation {{
                updateForm(id: {self.form.id}, formData: {{
                    name: "UPDATED"
                    description: "{self.DESCRIPTION}"
                    organizationId: {self.organization.id}
                }}) {{
                    ok
                    form {{
                        id
                        name
                        description
                        organization {{
                            id
                        }}
                    }}
                }}
            }}
        """

        self.DELETE_MUTATION = f"""
            mutation {{
                deleteForm(id: {self.form.id}) {{
                    ok
                }}
            }}
        """

        self.QUESTION = "QUESTION"
        self.CREATE_QUESTION_MUTATION = f"""
            mutation {{
                createQuestion(formId: {self.form.id}, questionData: {{
                    question: "{self.QUESTION}"
                    description: "{self.DESCRIPTION}"
                    questionType: PARAGRAPH
                }}) {{
                    ok
                    question {{
                        id
                        question
                    }}
                }}
            }}
        """

        self.UPDATE_QUESTION_MUTATION = f"""
            mutation {{
                updateQuestion(id: {self.short_question.id}, questionData: {{
                    question: "{self.QUESTION}"
                    description: "{self.QUESTION}"
                    questionType: PARAGRAPH
                }}) {{
                    ok
                    question {{
                        id
                        question
                    }}
                }}
            }}
        """

        self.DELETE_QUESTION_MUTATION = f"""
            mutation {{
                deleteQuestion(id: {self.short_question.id}) {{
                    ok
                }}
            }}
        """


class FormsMutationTestCase(FormBaseTestCase):
    def test_unauthenticated_create_form(self):
        response = self.query(self.CREATE_MUTATION)
        self.assert_permission_error(response)

    def test_unauthenticated_change_form(self):
        response = self.query(self.UPDATE_MUTATION)
        self.assert_permission_error(response)

    def test_unauthenticated_delete_form(self):
        response = self.query(self.DELETE_MUTATION)
        self.assert_permission_error(response)

    def test_unauthorized_create_form(self):
        response = self.query(self.CREATE_MUTATION, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_unauthorized_change_form(self):
        response = self.query(self.UPDATE_MUTATION, user=self.unauthorized_user)
        self.assert_permission_error(response)

        assign_perm("forms.change_form", self.unauthorized_user)
        response = self.query(self.UPDATE_MUTATION, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_unauthorized_delete_form(self):
        response = self.query(self.DELETE_MUTATION, user=self.unauthorized_user)
        self.assert_permission_error(response)

        assign_perm("forms.delete_form", self.unauthorized_user)
        response = self.query(self.DELETE_MUTATION, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_create_form(self):
        response = self.query(self.CREATE_MUTATION, user=self.authorized_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        response_form = data["createForm"]["form"]
        form = Form.objects.get(pk=response_form["id"])
        if form is None:
            self.assertIsNotNone(form, msg=f"Expected form after creation, got {None}")
        else:
            self.assertTrue(data["createForm"]["ok"])
            self.deep_assert_equal(response_form, form)

    def test_update_form(self):
        response = self.query(self.UPDATE_MUTATION, user=self.authorized_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        response_form = data["updateForm"]["form"]
        form = Form.objects.get(pk=self.form.id)
        self.assertTrue(data["updateForm"]["ok"])
        self.deep_assert_equal(response_form, form)

    def test_delete_form(self):
        response = self.query(self.DELETE_MUTATION, user=self.authorized_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        self.assertTrue(data["deleteForm"]["ok"])
        self.assertFalse(Form.objects.filter(pk=self.form.id).exists())

    def test_authorized_add_question(self):
        response = self.query(self.CREATE_QUESTION_MUTATION, user=self.authorized_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        question: Optional[Question] = Question.objects.get(
            pk=data["createQuestion"]["question"]["id"]
        )

        if question is None:
            self.assertIsNotNone(question)
        else:
            self.assertTrue(data["createQuestion"]["ok"])
            self.deep_assert_equal(data["createQuestion"]["question"], question)

    def test_authorized_update_question(self):
        response = self.query(self.UPDATE_QUESTION_MUTATION, user=self.authorized_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        question: Question = Question.objects.get(pk=self.short_question.id)

        self.assertTrue(data["updateQuestion"]["ok"])
        self.deep_assert_equal(data["updateQuestion"]["question"], question)

    def test_authorized_delete_question(self):
        response = self.query(self.DELETE_QUESTION_MUTATION, user=self.authorized_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        self.assertFalse(Question.objects.filter(pk=self.short_question.id).exists())

        self.assertTrue(data["deleteQuestion"]["ok"])


class FormsQueryTestCase(FormBaseTestCase):
    FORMS_WITH_RESPONSES = f"""
        query {{
            forms {{
                id
                name
                description
                responses {{
                    id
                }}
                responders {{
                    id
                }}
            }}
        }}
    """

    FORMS = f"""
        query {{
            forms {{
                id
                name
                description
                questions {{
                    id
                    question
                }}
            }}
        }}
    """

    def test_unauthenticated_get_forms(self):
        unauthorized_response = self.query(
            self.FORMS_WITH_RESPONSES, user=self.unauthorized_user
        )
        data = json.loads(unauthorized_response.content)["data"]
        self.assert_null_fields(data, ["responses", "responders"])

        response = self.query(self.FORMS, user=self.unauthorized_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        form_data = data["forms"]
        forms = Form.objects.all().count()
        self.assertEqual(len(form_data), forms)

    def test_authorized_get_forms(self):
        response = self.query(self.FORMS_WITH_RESPONSES, user=self.authorized_user)
        data = json.loads(response.content)["data"]
        forms = Form.objects.all()
        forms_response: list[dict[str, Any]] = data["forms"]

        for form_response in forms_response:
            form = forms.get(pk=form_response["id"])
            if form_response["id"] == str(self.form.id):
                self.deep_assert_equal(form_response, form)
            else:
                self.assert_null_fields(form_response, ["responses", "responders"])

        self.assertResponseNoErrors(response)
