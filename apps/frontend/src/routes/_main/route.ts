import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "@/widgets/main-layout";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});
