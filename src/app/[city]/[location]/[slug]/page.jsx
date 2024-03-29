import ProjectGallery from "@/components/project-page/project-gallery/ProjectGallery";
import ProjectLocation from "@/components/project-page/project-location/ProjectLocation";
import RatingSection from "@/components/project-page/rating-section/RatingSection";
import RecentTransactions from "@/components/project-page/recent-transactions/RecentTransactions";
import ReviewSection from "@/components/project-page/review-section/ReviewSection";
import SimilarProjectsSlider from "@/components/property-slider/SimilarProjectsSlider";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";

export default async function page({ params }) {
  const { city, location, slug } = params;
  const projectData = await getSingleProjectAPI(city, location, slug);
  return (
    <main>
      <ProjectGallery city={city} location={location} slug={slug} />
      <RecentTransactions city={city} location={location} slug={slug} />
      <RatingSection city={city} location={location} slug={slug} />
      <ReviewSection city={city} location={location} slug={slug} />
      <ProjectLocation city={city} location={location} slug={slug} />
      <SimilarProjectsSlider params={params} projectName={projectData?.name} />
    </main>
  );
}
