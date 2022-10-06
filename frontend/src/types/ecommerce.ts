import { OrderFragment, ProductFragment } from "@/generated/graphql";
import { GraphqlType } from "@/utils/graphql";

export type Product = GraphqlType<ProductFragment>;

export type Order = GraphqlType<OrderFragment>;
