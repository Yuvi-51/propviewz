import OtherPropertyCard from "@/components/property-card/OtherPropertyCard";
import PropertyCardSkeleton from "@/components/property-card/PropertyCardSkeleton";
import CollectionsPagination from "@/components/ui/pagination";
import { getAllProjectsAPI } from "@/connections/get-requests/getAllProjectsAPI";
import { cityNameToId } from "@/logic/conversions";
import "../category-page.scss";


export default async function MostTrendingPage({ params, searchParams }) {
  const cityId = cityNameToId(params?.city);
  const page = searchParams?.page || 1;
  const mostTrendingProjects = await getAllProjectsAPI(
    "trending",
    page,
    cityId
  );
  const totalPagesCount = Math.ceil(mostTrendingProjects?.count / 12);

  const isLoading = false;

  return (
    <main className="most-trending-main-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Most Trending</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <div className="grid-container">
        {isLoading
          ? Array(12)
              .fill(null)
              .map((el, id) => <PropertyCardSkeleton key={id} />)
          : mostTrendingProjects?.data?.map((el) => (
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
