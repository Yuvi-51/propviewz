import ModalWrapper from "@/components/wrappers/ModalWrapper";
import { postLatestTxnRequestAPI } from "@/connections/post-requests/postLatestTxnRequestAPI";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
import "./LatestTxnRequest.scss";

import ReactGA from "react-ga";
import { useToast } from "../ui/use-toast";

export default function LatestTxnRequest({
  triggerElement,
  projectId,
  unitCategory,
  type,
}) {
  const token = useSelector((state) => state.auth.token);
  const [loader, setLoader] = useState(false);
  const [modalState, setModalState] = useState(false);
  const { toast } = useToast();

  const handleTransactionRequest = async (empty, callbackToken) => {
    ReactGA.event({
      category: "User",
      action: "User Sent a Txn Request",
      label: "Button Click",
    });

    setLoader(true);
    const payload = {
      project_id: projectId,
      unit_category: unitCategory,
      transaction_type: type,
      request_type: "latest_transaction_request",
    };
    try {
      const res = await postLatestTxnRequestAPI(
        payload,
        callbackToken || token
      );
      setLoader(false);
      if (res?.status?.status === "SUCCESS") {
        toast({
          variant: "success",
          title: "Latest Transaction Request Sent",
          description:
            "Well Done! It will get displayed after approval from management",
        });
        setModalState(false);
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try after some time",
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try after some time",
      });
    }
  };

  return (
    <ProtectedRouteWrapper
      triggerElement={triggerElement}
      callback={handleTransactionRequest}
    >
      <ModalWrapper
        open={modalState}
        setOpen={setModalState}
        trigger={triggerElement}
      >
        <div className="latest_txn_request">
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Are you sure you want to request the latest transaction For{" "}
            <span style={{ color: "#f1592a" }}>
              {" "}
              {unitCategory} {type}
            </span>
            ?{"  "}If yes, please press 'Ok' to continue.
          </h3>

          <button
            className="border-[1px] border-[#f1592a] w-max m-auto px-[25px] py-[5px] text-[#f1592a] rounded-[3px]"
            onClick={() => {
              handleTransactionRequest();
            }}
          >
            {loader ? (
              <ScaleLoader color="#f1592a" height={25} radius={5} width={4} />
            ) : (
              "OK"
            )}
          </button>
        </div>
      </ModalWrapper>
    </ProtectedRouteWrapper>
  );
}
