import graphene


class InitiateOrder(graphene.mutation):

    redirect = graphene.String()

    class Arguments:
        fallback = graphene.String()

    def mutate(self, info, fallback):
        redirect = ""

        return InitiateOrder(redirect=redirect)