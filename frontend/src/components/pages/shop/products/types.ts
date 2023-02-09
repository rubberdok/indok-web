import { OrganizationType } from "@/generated/graphql";

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  organizationId: number;
  total_quantity: number;
  current_quantity: number | null;
  max_buyable_quantity: number;
  image: {
    src: string;
    alt: string;
  };
};

/*
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=11, decimal_places=2)
    description = models.TextField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="products")
    total_quantity = models.PositiveIntegerField()
    current_quantity = models.PositiveIntegerField(null=True)  # Set to total_quantity upon initialization
    max_buyable_quantity = models.PositiveIntegerField(default=1)

    # Generic foreign key to related product model instance (e.g event model)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey("content_type", "object_id")
*/
