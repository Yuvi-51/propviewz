import OtherPropertyCard from "@/components/property-card/OtherPropertyCard";
import PropertyCardSkeleton from "@/components/property-card/PropertyCardSkeleton";
import CollectionsPagination from "@/components/ui/pagination";
import { getAllProjectsAPI } from "@/connections/get-requests/getAllProjectsAPI";
import { cityNameToId } from "@/logic/conversions";
import "../category-page.scss";

export default async function TopRatedPage({ params, searchParams }) {
  const cityId = cityNameToId(params?.city);
  const page = searchParams?.page || 1;
  const topRatedProjects = await getAllProjectsAPI("top-rated", page, cityId);
  const totalPagesCount = Math.ceil(topRatedProjects?.count / 12);
  const isLoading = false;

  return (
    <main className="most-trending-main-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Top Rated</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <div className="grid-container">
        {isLoading
          ? Array(12)
              .fill(null)
              .map(() => <PropertyCardSkeleton />)
          : topRatedProjects?.data?.map((el) => (
              <OtherPropertyCard item={el} key={el.project_id} />
            ))}
      </div>
      <div className="my-[20px] flex justify-end">
        <CollectionsPagination
          totalPagesCount={totalPagesCount}
          currentPage={page}
        />
      </div>
    </main>
  );
}
