import OtherPropertyCard from "@/components/property-card/OtherPropertyCard";
import PropertyCardSkeleton from "@/components/property-card/PropertyCardSkeleton";
import { getAllProjectsAPI } from "@/connections/get-requests/getAllProjectsAPI";
import "../category-page.scss";
import { cityNameToId } from "@/logic/conversions";
import CollectionsPagination from "@/components/ui/pagination";

export default async function MostReviewedPage({ params, searchParams }) {
  const cityId = cityNameToId(params?.city);
  const page = searchParams?.page || 1;
  const mostReviewedProjects = await getAllProjectsAPI(
    "most-reviewed",
    page,
    cityId
  );
  const totalPagesCount = Math.ceil(mostReviewedProjects?.count / 12);

  const isLoading = false;

  return (
    <main className="most-trending-main-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Most Reviewed</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <div className="grid-container">
        {isLoading
          ? Array(12)
              .fill(null)
              .map(() => <PropertyCardSkeleton />)
          : mostReviewedProjects?.data?.map((el) => (
              <OtherPropertyCard item={el} key={el.project_id} />
            ))}
      </div>
      <div className="my-[20px] flex justify-end ">
        <CollectionsPagination
          totalPagesCount={totalPagesCount}
          currentPage={page}
        />
      </div>
    </main>
  );
}
