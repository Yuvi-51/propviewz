import AddReviewModal from "@/components/modal-content/AddReviewModal";
import PostPictureModal from "@/components/modal-content/PostPictureModal";
import { CameraIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import "./ShareViewCards.scss";

export default function ShareViewCards() {
  return (
    <div className="share-view-cards-container">
      <div className="carousal-heading w-full">
        <div className="p-heading">
          <h3>Share your views with us!</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <div className="home-cards">
        <div className="card card-bg-review">
          <div className="review-content">
            <p className="card-text">
              Write a review on any Property or Area and help other people to
              know more.
            </p>
            <AddReviewModal
              triggerElement={
                <div className="btn">
                  <StarIcon />
                  Add Review
                </div>
              }
            />
          </div>
          <div>
            <Image
              src="/images/amico(1).svg"
              alt=""
              className="home-card-img"
              width={120}
              height={120}
            />
          </div>
        </div>
        <div className="card card-bg-post">
          <div className="review-content">
            <p className="card-text">
              Click a picture of any Property or Area and upload it.
            </p>
            <PostPictureModal
              triggerElement={
                <div className="btn">
                  <CameraIcon />
                  Post a Picture
                </div>
              }
            />
          </div>
          <div>
            <Image
              src="/images/amico.svg"
              alt=""
              className="home-card-img"
              width={120}
              height={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
