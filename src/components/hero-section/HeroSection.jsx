import Image from "next/image";
import ProjectAndLocationSearch from "../project-&-location-search/Project&LocationSearch";
import RecentTransactionSlider from "../property-slider/RecentTransactionSlider";
import UserDrawer from "../user-drawer/UserDrawer";
import CitySelectComp from "./CitySelectComp";
import "./HeroSection.scss";

export default async function HeroSection({ cityId }) {
  return (
    <div className="hero-section">
      <div className="content">
        <div className="home-logo">
          <Image
            className="logo"
            src="/images/final_Propviewz_logo_17 nov-03.svg"
            alt="propviewz_logo"
            width={142}
            height={50}
          />
        </div>
        <div className="flex gap-4">
          <div className="city-select">
            <CitySelectComp />
          </div>
          <div className="u-icon">
            <UserDrawer />
            <div className="footer-icons">
              <a
                href="https://www.facebook.com/propviewz/?modal=admin_todo_tour"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/Facebook Fill.svg"
                  aria-hidden="true"
                  href="/"
                  alt=""
                ></img>
              </a>
              <a
                href="https://www.linkedin.com/company/68974999/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src="/images/Linkedin Fill.svg"
                  aria-hidden="true"
                  href="/"
                  alt=""
                ></img>
              </a>
              <a
                href="https://www.instagram.com/propviewz/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src="/images/Instagram Fill.svg"
                  aria-hidden="true"
                  href="/"
                  alt=""
                ></img>
              </a>
              <a
                href="https://twitter.com/propviewz"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/Twitter Fill.svg"
                  aria-hidden="true"
                  href="/"
                  alt=""
                ></img>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="reverse-flex">
        <h1 className="header">Har property ki sacchai..</h1>
        <h2 className="sub-header">
          Know Actual Selling Prices & User Reviews.
        </h2>
        <div className="hero-search-wrapper">
          <div>
            <CitySelectComp />
          </div>
          <div className="hero-project-search-input-container">
            <ProjectAndLocationSearch />
          </div>
        </div>
      </div>
      <div className="card-details">
        <div className="lines">
          <p className="s-lines"></p>
          <p className="line"></p>
          <p className="line-content">Recent Transactions</p>
          <p className="line"></p>
          <p className="s-lines"></p>
        </div>
        {/* <ErrorBoundary>  */}
        <RecentTransactionSlider cityId={cityId} />
        {/* </ErrorBoundary> */}
      </div>
    </div>
  );
}
