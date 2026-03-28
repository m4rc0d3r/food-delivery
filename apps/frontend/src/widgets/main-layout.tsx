import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Str } from "@workspace/core";
import { BookImage, MenuIcon, Moon, ShoppingCart, Store, Sun, UserIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { toast } from "sonner";

import type { Me } from "@/entities/auth";
import { AuthQuery, AuthStatus, useAuthStore } from "@/entities/auth";
import { useDiContainer } from "@/entities/di";
import { UserQuery } from "@/entities/user";
import type { Theme } from "@/shared/theming";
import { THEMES, useTheme } from "@/shared/theming";
import { cn } from "@/shared/ui/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Skeleton,
} from "@/shared/ui/primitives";

function MainLayout() {
  const { userService } = useDiContainer();
  const { data: me } = UserQuery.useGetMe(userService, {
    retry: false,
  });

  const status = useAuthStore.use.status();

  const menuItems = [
    {
      name: "Catalog",
      Icon: BookImage,
      path: "/",
    },
    {
      name: "Shopping cart",
      Icon: ShoppingCart,
      path: "/",
    },
  ] as const;

  const authMenuItems = [
    {
      name: "Log in",
      path: "/login",
      variant: "ghost" satisfies ComponentProps<typeof Button>["variant"],
    },
    {
      name: "Register",
      path: "/register",
      variant: "outline" satisfies ComponentProps<typeof Button>["variant"],
    },
  ] as const;

  return (
    <div className="flex h-full flex-col">
      <header>
        <nav>
          <ul className="flex justify-between gap-2 border-b p-2">
            <li className="flex items-center md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {menuItems.map((item, index) => {
                    const { name, Icon } = item;
                    return (
                      <DropdownMenuItem key={index} asChild>
                        <Link to={item.path}>
                          <Icon />
                          {name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link to="/">
                <Store className="size-10" />
              </Link>
            </li>
            <li className="hidden items-center md:flex">
              <ul className="flex">
                {menuItems.map((item, index) => {
                  const { name } = item;
                  return (
                    <li key={index}>
                      <Button asChild variant="link">
                        <Link to={item.path}>{name}</Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="flex items-center">
              <ul className="flex gap-2">
                <li className="flex items-center">
                  <ul className="flex gap-1">
                    <li className="flex items-center">
                      <ThemeSwitcher />
                    </li>
                  </ul>
                </li>
                <li className="flex items-center">
                  {status === AuthStatus.AUTHENTICATED && me ? (
                    <MeSection data={me} />
                  ) : status === AuthStatus.UNAUTHENTICATED ? (
                    <ul className="flex gap-1">
                      {authMenuItems.map(({ name, path, variant }, index) => (
                        <li
                          key={path}
                          className={cn(
                            index === authMenuItems.length - 1 && "hidden sm:list-item",
                          )}
                        >
                          <Button asChild variant={variant}>
                            <Link to={path}>{name}</Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Skeleton className="h-8 w-36"></Skeleton>
                  )}
                </li>
              </ul>
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

function ThemeSwitcher(props: ComponentProps<typeof DropdownMenu>) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          {THEMES.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {Str.capitalize(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type MeSectionProps = ComponentProps<typeof DropdownMenu> & {
  data: Me;
};

function MeSection({ data, ...props }: MeSectionProps) {
  const navigate = useNavigate();

  const { authService } = useDiContainer();
  const { mutate: logout, isPending: isLogoutPending } = AuthQuery.useLogout(authService);
  const logoutLocally = useAuthStore.use.logout();

  const handleLogout = () => {
    logout(void 0, {
      onSuccess: () => {
        toast.success("Account logout successful");
      },
      onError: () => {
        toast.error("Failed to log out of account");
      },
      onSettled: () => {
        logoutLocally();
        // @ts-expect-error Root route must be present
        void navigate("/");
      },
    });
  };

  const { fullName } = data;

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="max-w-36">
          <UserIcon />
          <span className="overflow-hidden text-ellipsis">{fullName || "Without a name"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout} disabled={isLogoutPending}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { MainLayout };
