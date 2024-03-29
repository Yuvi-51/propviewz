import { PaginationItemType, cn } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const paginationRenderItem = ({
  ref,
  value,
  isActive,
  onNext,
  onPrevious,
  setPage,
  className,
}) => {
  if (value === PaginationItemType.NEXT) {
    return (
      <button
        className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
        onClick={onNext}
        // disabled={value === mostReviewedProjects?.count ? true : false}
      >
        <ChevronRightIcon />
      </button>
    );
  }

  if (value === PaginationItemType.PREV) {
    return (
      <button
        className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
        onClick={onPrevious}
        // disabled={value === 1 ? true : false}
      >
        <ChevronLeftIcon />
      </button>
    );
  }

  if (value === PaginationItemType.DOTS) {
    return <button className={className}>...</button>;
  }

  return (
    <button
      ref={ref}
      className={cn(
        className,
        isActive &&
          "!text-[#f1592a] bg-transparent border-[2px] border-[#f1592a] font-bold px-[10px]"
      )}
      onClick={() => setPage(value)}
    >
      {value}
    </button>
  );
};
