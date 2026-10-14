import CruisePageLayout from "@/components/pages/cruises/CruisePageLayout";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("cruises");

export default function CruisesPage() {
  return (
    <>
      <NewNavbar />
      <CruisePageLayout />
    </>
  );
}
