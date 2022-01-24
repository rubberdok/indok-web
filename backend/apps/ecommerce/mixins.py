from abc import abstractmethod


class Sellable:
    """
    All models connected to a product through the GenericForeignKey related_object should inherit from this class.
    If needed, redefine is_user_allowed_to_buy_product to allow users to buy products related to the model based on
    some criteria.
    """

    @abstractmethod
    def is_user_allowed_to_buy_product(self, user):
        return True
