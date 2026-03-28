import { Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/shared/ui/primitives";

function AuthLayout() {
  return (
    <div className="flex h-full flex-col">
      <header>
        <nav>
          <ul className="flex justify-between gap-2 border-b p-2">
            <li>
              <Button
                asChild
                variant="ghost"
                size="icon"
                onClick={() => {
                  window.history.back();
                }}
              >
                <ArrowLeft />
              </Button>
            </li>
            <li>
              <Button asChild variant="outline" size="icon">
                <Link to="/">
                  <Home />
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export { AuthLayout };
