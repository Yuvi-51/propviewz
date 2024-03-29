"use client";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import { Pagination } from "@nextui-org/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function CollectionsPagination({
  totalPagesCount,
  currentPage,
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("page", term);
    } else {
      params.delete("page");
    }
    push(`${pathname}?${params.toString()}`);
  };

  return totalPagesCount > 1 ? (
    <Pagination
      disableCursorAnimation
      showControls
      page={Number(currentPage)}
      total={totalPagesCount}
      initialPage={1}
      onChange={handleSearch}
      radius="full"
      renderItem={paginationRenderItem}
    />
  ) : null;
}
