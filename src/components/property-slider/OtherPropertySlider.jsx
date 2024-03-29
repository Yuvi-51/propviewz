import { SliderProvider } from "@/app/providers";
import { getCategoryProjectsAPI } from "@/connections/get-requests/getCategoryProjectsAPI";
import OtherPropertyCard from "../property-card/OtherPropertyCard";

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

export default async function OtherPropertySlider({ id, cityId }) {
  // await timeout(50000);
  const value = await getCategoryProjectsAPI(id, cityId);

  return (
    <SliderProvider>
      {value?.map((el) => (
        <OtherPropertyCard item={el} key={el.project_id} />
      ))}
    </SliderProvider>
  );
}
