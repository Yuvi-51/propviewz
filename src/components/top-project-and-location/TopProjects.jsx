import { getTopProjectsAPI } from "@/connections/get-requests/getTopProjectsAPI";
import { cityIdToName } from "@/logic/conversions";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function TopProjects() {
  const cookieCityId = cookies().get("cityID")?.value || 2209;
  const topProjects = await getTopProjectsAPI(cookieCityId);

  return (
    <div className="top-projects">
      <h3>TOP PROJECTS</h3>
      {topProjects?.map((data) => (
        <div key={data.id}>
          <Link
            href={`/${cityIdToName(cookieCityId)}/${data?.location_slug}/${
              data.slug
            }`}
            className="text"
          >
            {data?.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
