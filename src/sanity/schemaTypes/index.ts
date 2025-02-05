import { type SchemaTypeDefinition } from "sanity";
import { productSchema } from "./products";
import { categorySchema } from "./categories";
import { order } from "./order";
import { cartItem } from "./cartItem";


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema, categorySchema,order,cartItem],
};