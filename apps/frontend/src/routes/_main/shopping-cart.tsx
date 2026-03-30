import { createFileRoute } from "@tanstack/react-router";

import { ShoppingCartPage } from "@/pages/shopping-cart";

export const Route = createFileRoute("/_main/shopping-cart")({
  component: ShoppingCartPage,
});
