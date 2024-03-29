"use client";
import { cityData } from "@/constants/initialStateData";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactGA from "react-ga";
import ModalWrapper from "../wrappers/ModalWrapper";
import { setClientCookie } from "@/logic/clientCookie";
export default function CitySelectModal({ triggerElement }) {
  const [modalState, setModalState] = useState(false);
  const router = useRouter();

  return (
    <ModalWrapper
      open={modalState}
      setOpen={setModalState}
      trigger={triggerElement}
      title={
        <div className="carousal-heading">
          <div className="p-heading">
            <h3>Select Your City</h3>
            <div className="trend-line"></div>
          </div>
        </div>
      }
    >
      <div className="text-center flex flex-wrap justify-evenly gap-5">
        {cityData.map((data, i) => (
          <div
            key={i}
            style={{ cursor: "pointer" }}
            className="flex flex-column align-items-center"
            onClick={() => {
              setClientCookie("cityID", data.id, 30);
              ReactGA.event({
                category: "User",
                action: "User Selected City",
                label: "Button Click",
              });
              router.replace(`/${data?.name}`);
              router.refresh(); 
              setModalState(false);
            }}
          >
            <div className="flex flex-col items-center gap-3 font-bold">
              <Image style={{ maxWidth: 100 }} src={data.img} alt="img" />
              <p className="text-[#f1592a]" htmlFor={data.name}>
                {data.name.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
}
