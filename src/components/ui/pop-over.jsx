import useClickOutside from "@/custom/useClickOutside";
import React, { useRef, useState } from "react";

export default function PopOver({ trigger, children, isModalOpen }) {
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef(null);

  useClickOutside(popoverRef, () => {
    setIsVisible(false);
  });
  const closeDropdown = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative" ref={isModalOpen ? popoverRef : null}>
      {React.cloneElement(trigger, {
        onClick: () => setIsVisible((prev) => !prev),
      })}
      {isVisible && children(closeDropdown)}
    </div>
  );
}
