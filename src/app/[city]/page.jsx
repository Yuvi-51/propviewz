import CategoryHeader from "@/components/header/category-header/CategoryHeader";
import HeroSection from "@/components/hero-section/HeroSection";
import AdvertisementCards from "@/components/home-page/advertisement-cards/AdvertisementCards";
import BuyNowCards from "@/components/home-page/buy-now-cards/BuyNowCards";
import NewsletterSection from "@/components/home-page/newsletter-section/NewsletterSection";
import PaymentCards from "@/components/home-page/payment-cards/PaymentCards";
import ShareViewCards from "@/components/home-page/share-view-cards/ShareViewCards";
import PropertyCardSkeleton from "@/components/property-card/PropertyCardSkeleton";
import OtherPropertySlider from "@/components/property-slider/OtherPropertySlider";
import { cityNameToId } from "@/logic/conversions";
import Link from "next/link";
import { Suspense } from "react";

// import generateSitemap from "./generateSiteMap";

export default async function Home({ params }) {
  const city = params?.city;
  const cityId = cityNameToId(city);

  return (
    <>
      <header className="home-header-sticky">
        <CategoryHeader scrollToVisible={true} />
      </header>
      <main>
        <HeroSection cityId={cityId} />
        <section className="main-container">
          <div className="carousal-heading" id={"trending"}>
            <div className="p-heading">
              <h3>{"Most Trending"}</h3>
              <div className="trend-line"></div>
            </div>
            <Link href={`${city}/most-trending`} className="see-more">
              View All
            </Link>
          </div>
          <Suspense fallback={<PropertyCardSkeleton count={3} />}>
            <OtherPropertySlider id={"trending"} cityId={cityId} />
          </Suspense>
          <BuyNowCards />
          <div className="carousal-heading" id={"top-rated"}>
            <div className="p-heading">
              <h3>Top Rated</h3>
              <div className="trend-line"></div>
            </div>
            <Link href={`${city}/top-rated`} className="see-more">
              View All
            </Link>
          </div>
          <Suspense fallback={<PropertyCardSkeleton count={3} />}>
            <OtherPropertySlider id={"top-rated"} cityId={cityId} />
          </Suspense>
          <ShareViewCards />
          <div className="carousal-heading" id={"most-reviewed"}>
            <div className="p-heading">
              <h3>Most Reviewed</h3>
              <div className="trend-line"></div>
            </div>
            <Link href={`${city}/most-reviewed`} className="see-more">
              View All
            </Link>
          </div>
          <Suspense fallback={<PropertyCardSkeleton count={3} />}>
            <OtherPropertySlider id={"most-reviewed"} cityId={cityId} />
          </Suspense>
          <AdvertisementCards />
          <PaymentCards />
          <NewsletterSection />
        </section>
      </main>
    </>
  );
}
