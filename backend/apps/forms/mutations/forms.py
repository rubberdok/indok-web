import graphene

from apps.forms.models import Form
from apps.forms.types import FormType
from apps.listings.models import Listing
from apps.organizations.models import Organization
from apps.organizations.permissions import check_user_hr_membership, check_user_membership

from decorators import login_required


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
    organization_id = graphene.ID(required=True)


class CreateForm(graphene.Mutation):
    form = graphene.Field(FormType)
    ok = graphene.Boolean()

    class Arguments:
        listing_id = graphene.ID()
        form_data = CreateFormInput(required=True)

    @login_required
    def mutate(self, info, form_data, listing_id=None):
        organization = Organization.objects.get(pk=form_data["organization_id"])
        check_user_hr_membership(info.context.user, organization)

        form = Form()
        for key, value in form_data.items():
            setattr(form, key, value)
        form.save()
        if listing_id:
            listing = Listing.objects.get(pk=listing_id)
            if listing.organization_id != organization.id:
                raise ValueError("Skjema og utlysning må tilhøre samme forening")
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
    def mutate(self, info, id, form_data):
        form = Form.objects.get(pk=id)
        check_user_membership(info.context.user, form.organization)
        for key, value in form_data.items():
            if key == "organization_id" and int(value) != form.organization_id:
                raise ValueError("Et skjema kan ikke flyttes til en annen forening")
            setattr(form, key, value)
        form.save()
        return UpdateForm(form=form, ok=True)


class DeleteForm(graphene.Mutation):
    deleted_id = graphene.ID()
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        form = Form.objects.get(pk=id)
        check_user_hr_membership(info.context.user, form.organization)
        deleted_id = form.id
        form.delete()
        return DeleteForm(deleted_id=deleted_id, ok=True)
