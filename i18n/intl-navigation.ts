import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Raw next-intl navigation (locale-aware only — no country segment).
export const {
  Link: IntlLink,
  redirect,
  usePathname,
  useRouter: useIntlRouter,
  getPathname,
} = createNavigation(routing);
