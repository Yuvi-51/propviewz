import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import { getLandingSlugAPI } from "@/connections/get-requests/getLandingSlugAPI";
import { notFound } from "next/navigation";
import Script from "next/script";
import { JSON_LD_SCHEMA } from "@/app/[city]/[location]/[slug]/schema";
export async function generateMetadata({ params, searchParams }) {
  const { landing_slug } = params;
  const currentPage = searchParams?.page || 1;
  const locationData = await getLandingSlugAPI(landing_slug, currentPage);
  const dataNotFound = Boolean(!locationData?.payload?.project_cards?.length);
  const totalProjectsCount = locationData?.meta?.count;
  const formattedTitle = landing_slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (dataNotFound) {
    return {
      title: "Page Not Found",
      description: "This page does not exist on propviewz.com",
    };
  } else {
    return {
      title: `Find ${searchParams?.configurations || " "} ${
        searchParams?.unitType || " "
      } in ${searchParams?.locations || " "} ${
        searchParams?.city || " "
      } on propviewz.com, India's No.1 Real estate Transaction verification Portal. Explore ${
        searchParams?.configurations || " "
      } ${searchParams?.unitType || " "} in ${searchParams?.locations || " "} ${
        searchParams?.city || " "
      }  and nearby properties based on their public reviews ✓ ${totalProjectsCount} Properties`,
    };
  }
}

export default async function LandingSlugLayout({
  children,
  params,
  searchParams,
}) {
  const { landing_slug } = params;
  const currentPage = searchParams?.page || 1;

  const locationData = await getLandingSlugAPI(landing_slug, currentPage);
  const dataNotFound = Boolean(!locationData?.payload?.project_cards?.length);
  if (dataNotFound) {
    notFound();
  }

  return (
    <>
      {locationData.payload?.project_cards.map((item) => (
        <Script
          key={item?.project_id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(JSON_LD_SCHEMA(locationData)),
          }}
        />
      ))}

      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
