import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function PopoverWrapper({ triggerElement, children }) {
  return (
    <Popover>
      <PopoverTrigger>{triggerElement}</PopoverTrigger>
      <PopoverContent className="text-center p-[0]">{children}</PopoverContent>
    </Popover>
  );
}
