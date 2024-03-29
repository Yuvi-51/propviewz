import React from "react";
import "./AdvertisementCards.scss";
import { advertisementCardsData } from "@/constants/initialStateData";

export default function AdvertisementCards() {
  return (
    <div className="main-advertise">
      {advertisementCardsData.map((data, i) => (
        <div className="details" key={i}>
          <img src={data.img} alt={`advertisement-card-${i}`} />
        </div>
      ))}
      <div className="mobile-add">
        <img src="/images/adverimage1.jpg" alt="adverimage1" />
        <img src="images/adverimgae3.jpg" alt="adverimgae3" />
      </div>
    </div>
  );
}
