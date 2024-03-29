import { SliderProvider } from "@/app/providers";
import Link from "next/link";
import OtherPropertyCard from "../property-card/OtherPropertyCard";
import { getSimilarProjectsAPI } from "@/connections/get-requests/getCategoryProjectsAPI";
import { cityNameToId } from "@/logic/conversions";

export default async function SimilarProjectsSlider({ params, projectName }) {
  const { city, slug } = params;
  const cityId = cityNameToId(city);
  const similarProjectsPayload = await getSimilarProjectsAPI(slug, 1, cityId);

  return similarProjectsPayload?.data?.length ? (
    <section className="main-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>{"Similar Projects"}</h3>
          <div className="trend-line"></div>
        </div>
        {similarProjectsPayload?.data?.length > 3 ? (
          <Link
            href={`/${city}/similar-projects/${slug}?project_name=${projectName}`}
            className="see-more"
          >
            View All
          </Link>
        ) : null}
      </div>
      {similarProjectsPayload?.data?.length > 3 ? (
        <SliderProvider>
          {similarProjectsPayload?.data?.map((el) => (
            <OtherPropertyCard item={el} key={el.project_id} />
          ))}
        </SliderProvider>
      ) : (
        <div className="md:flex justify-start m-auto">
          {similarProjectsPayload?.data?.map((el) => (
            <div className="lg:w-[33%] md:w-[50%]" key={el?.project_id}>
              <OtherPropertyCard item={el} key={el.project_id} />
            </div>
          ))}
        </div>
      )}
    </section>
  ) : null;
}
