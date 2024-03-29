"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionWrapper({
  triggerElement,
  children,
  isOpen = false,
}) {
  return (
    <Accordion
      className="w-full"
      type="single"
      defaultValue={isOpen ? "item-1" : null}
      collapsible
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="dropdown-hover">
          {triggerElement}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
