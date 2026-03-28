import { useEffect } from "react";
import { toast } from "sonner";

import { AuthStatus, useAuthStore } from "../model";

import type { EventBus } from "@/entities/event-bus/@x/auth";
import type { UserService } from "@/entities/user/@x/auth";
import { UserQuery } from "@/entities/user/@x/auth";

type Props = {
  userService: UserService;
  eventBus: EventBus;
};

function AuthResolver({ userService, eventBus }: Props) {
  const { data: me, isError: isMeError } = UserQuery.useGetMe(userService, {
    retry: false,
  });

  const status = useAuthStore.use.status();
  const loginLocally = useAuthStore.use.login();
  const logoutLocally = useAuthStore.use.logout();

  useEffect(() => {
    if (!(me || isMeError)) return;

    if (me) {
      loginLocally();
    } else if (isMeError) {
      logoutLocally();
    }
  }, [isMeError, loginLocally, logoutLocally, me]);

  useEffect(() => {
    const handleUnauth = () => {
      if (status !== AuthStatus.AUTHENTICATED) return;

      logoutLocally();
      toast.info("The authentication session has expired.");
    };

    const params = ["userNotAuthenticated", handleUnauth] as const;
    eventBus.on(...params);

    return () => {
      eventBus.off(...params);
    };
  }, [eventBus, logoutLocally, status]);

  return null;
}

export { AuthResolver };
