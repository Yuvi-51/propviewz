import ProjectHeader from "@/components/header/project-header/ProjectHeader";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import { validateImageUrl } from "@/logic/validation";
import { notFound } from "next/navigation";
import Script from "next/script";
import { JSON_LD_SCHEMA } from "./schema";
import useNotFound from "@/custom/useNotFound";
import { createPropertyHref } from "@/logic/conversions";

export async function generateMetadata({ params }) {
  const { city, location, slug } = params;

  const projectData = await getSingleProjectAPI(city, location, slug);
  const dataNotFound = useNotFound(projectData);
  if (!dataNotFound) {
    return {
      title: `${projectData?.name} in ${projectData?.detailed_area}, ${projectData?.city}`,
      description: ` ${projectData?.name}, ${projectData?.city}: View project reviews & last transaction price list of ${projectData?.name} ${projectData?.detailed_area}, ${projectData?.city}.`,
      openGraph: {
        title: `${projectData?.name} in ${projectData?.detailed_area}, ${projectData?.city}`,
        description: ` ${projectData?.name}, ${projectData?.city}: View project reviews & last transaction price list of ${projectData?.name} ${projectData?.detailed_area}, ${projectData?.city}.`,
        url: `${process.env.NEXT_PUBLIC_HOST}/${createPropertyHref(
          city,
          location,
          slug
        )}`,
        images: [`${validateImageUrl(projectData?.thumbnail)}`],
      },
      keywords: `${projectData?.name} in ${projectData?.detailed_area} reviews , Last Transaction Price`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_HOST}/${createPropertyHref(
          city,
          location,
          slug
        )}`,
      },
    };
  } else {
    return {
      title: "Page Not Found",
      description: "This page does not exist on propviewz.com",
    };
  }
}

export default async function ProjectLayout({ children, params }) {
  const { city, location, slug } = params;
  if (Object.keys(params)?.length !== 3) notFound();
  const projectData = await getSingleProjectAPI(city, location, slug);
  const dataNotFound = useNotFound(projectData);
  if (dataNotFound) {
    notFound();
  }
  return (
    <>
      <Script
        key={projectData?.id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD_SCHEMA(projectData)),
        }}
      />
      <header>
        <ProjectHeader params={params} />
      </header>
      {children}
    </>
  );
}
