import { SliderProvider } from "@/app/providers";
import { getRecentTransactionsAPI } from "@/connections/get-requests/getRecentTransactionsAPI";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  RecentPropertyCard,
  RecentPropertyCardSkeleton,
} from "../property-card/RecentPropertyCard";
export default async function RecentTransactionSlider({cityId}) {
  const loading = false;
  const value = await getRecentTransactionsAPI(cityId);
  return (
    <SliderProvider
      settings={{
        infinite: true,
        speed: 500,
        autoplay: true,
      }}
      className="main-container"
    >
      {loading
        ? Array(3)
            .fill(null)
            .map((el) => <RecentPropertyCardSkeleton key={el} />)
        : value?.map((el) => (
            <RecentPropertyCard item={el} key={el.project_id} />
          ))}
    </SliderProvider>
  );
}
