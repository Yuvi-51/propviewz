"use client";
import ModalWrapper from "../wrappers/ModalWrapper";

export default function SuccessInfoModal({
  modalState,
  setModalState,
  onMountComplete,
  children,
  onRefreshChange,
}) {
  const handleClick = () => {
    // Toggle the refresh state in the child component
    onRefreshChange((prevRefresh) => !prevRefresh);
  };
  return (
    <ModalWrapper open={modalState} setOpen={setModalState}>
      {children}
      <button
        className="border-[1px] border-[#f1592a] w-max m-auto px-[25px] py-[5px] text-[#f1592a] rounded-[3px]"
        onClick={() => {
          onMountComplete && onMountComplete();
          setModalState(false);
          if (onRefreshChange) {
            handleClick();
          }
        }}
      >
        Ok
      </button>
    </ModalWrapper>
  );
}
