import CollectionsPagination from "@/components/ui/pagination";
import { getSimilarProjectsAPI } from "@/connections/get-requests/getCategoryProjectsAPI";
import { cityNameToId } from "@/logic/conversions";
import "../../category-page.scss";
import OtherPropertyCard from "@/components/property-card/OtherPropertyCard";
import PropertyCardSkeleton from "@/components/property-card/PropertyCardSkeleton";

export default async function page({ params, searchParams }) {
  const cityId = cityNameToId(params?.city);
  const page = searchParams?.page || 1;
  const propertySlug = params?.slug;

  const similarProjectsDetails = await getSimilarProjectsAPI(
    propertySlug,
    page,
    cityId
  );

  const totalPagesCount = Math.ceil(similarProjectsDetails?.count / 12);

  const loading = false;

  return (
    <main className="most-trending-main-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>
            Similar Projects to{" "}
            <span style={{ color: "#f1592a", cursor: "pointer" }}>
              {searchParams?.project_name}
            </span>
          </h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <div className="grid-container">
        {loading
          ? Array(12)
              .fill(null)
              .map(() => <PropertyCardSkeleton />)
          : similarProjectsDetails?.data?.map((el) => (
              <OtherPropertyCard key={el.project_id} item={el} />
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
