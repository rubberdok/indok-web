import graphene
from graphql_jwt.decorators import login_required, permission_required

from apps.listing.models import Listing
from apps.forms.models import Form
from ..types import FormType


class FormInput(graphene.InputObjectType):
    name = graphene.String(required=False)
    organization_id = graphene.ID(required=False)
    description = graphene.String(required=False)


class BaseFormInput(graphene.InputObjectType):
    name = graphene.String()
    organization_id = graphene.ID()
    description = graphene.String()


class CreateFormInput(BaseFormInput):
    name = graphene.String(required=True)


class CreateForm(graphene.Mutation):
    form = graphene.Field(FormType)
    ok = graphene.Boolean()

    class Arguments:
        listing_id = graphene.ID()
        form_data = CreateFormInput(required=True)

    @login_required
    @permission_required("forms.add_form")
    def mutate(self, info, form_data, listing_id=None):
        form = Form()
        for key, value in form_data.items():
            setattr(form, key, value)
        form.save()
        if listing_id:
            listing = Listing.objects.get(pk=listing_id)
            listing.form = form
            listing.save()
        return CreateForm(form=form, ok=True)


class UpdateForm(graphene.Mutation):
    form = graphene.Field(FormType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()
        form_data = BaseFormInput(required=True)

    @login_required
    @permission_required("forms.update_form")
    def mutate(self, info, id, form_data):
        form = Form.objects.get(pk=id)
        for key, value in form_data.items():
            setattr(form, key, value)
        form.save()
        return UpdateForm(form=form, ok=True)


class DeleteForm(graphene.Mutation):
    deleted_id = graphene.ID()
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    @permission_required("forms.delete_form")
    def mutate(cls, self, info, id):
        form = Form.objects.get(pk=id)
        deleted_id = form.id
        form.delete()
        return DeleteForm(deleted_id=deleted_id, ok=True)
