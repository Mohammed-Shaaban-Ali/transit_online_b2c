import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export type IPaginationOptions = {
  currentPage: number;
  totalPages: number;
  limit: number;
  className?: string;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const BTNS_COUNT = 4;

export function CustomPagination({
  currentPage,
  totalPages,
  limit,
  className,
  totalItems: totalItemsGeter,
  onPageChange,
  onLimitChange,
}: IPaginationOptions) {
  const t = useTranslations("Pagination");

  const isFirstPage =
    currentPage === 1 || (totalPages === 0 && currentPage === 0);
  const isLastPage = currentPage === totalPages;
  const isFewPages = totalPages <= BTNS_COUNT;
  const isPrevDots = !isFewPages && currentPage > Math.ceil(BTNS_COUNT / 2);
  const isAfterDots =
    !isFewPages && currentPage < totalPages - Math.floor(BTNS_COUNT / 2);

  const totalItems = totalItemsGeter || totalPages * limit;

  // Dynamic LIMIT_OPTIONS calculation
  const limitOptions = useMemo(() => {
    const baseOptions = [10, 20, 50, 100];
    if (totalItems === 0) return baseOptions;

    const validOptions = baseOptions.filter((option) => option <= totalItems);

    if (!validOptions.includes(limit)) {
      validOptions.push(limit);
      validOptions.sort((a, b) => a - b);
    }

    const quarterItems = Math.ceil(totalItems / 4);
    const halfItems = Math.ceil(totalItems / 2);
    [quarterItems, halfItems].forEach((option) => {
      if (
        option > 0 &&
        option <= totalItems &&
        !validOptions.includes(option)
      ) {
        validOptions.push(option);
      }
    });

    return [...new Set(validOptions)].sort((a, b) => a - b);
  }, [totalItems, limit]);

  function generateArr(start: number, count = BTNS_COUNT) {
    return Array.from(
      { length: Math.min(count, totalPages - start + 1) },
      (_, i) => start + i
    );
  }

  const startPage = isFewPages
    ? 1
    : Math.max(
      1,
      Math.min(
        currentPage - Math.floor(BTNS_COUNT / 2),
        totalPages - BTNS_COUNT + 1
      )
    );

  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();

    // If callback is provided, use it (state-based)
    if (onPageChange) {
      onPageChange(page);
    }

  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    onLimitChange(newLimit);

  };

  const startItem = totalPages === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <section className="flex text-14 flex-col items-center justify-between w-full gap-4 lg:gap-6 p-4 py-3 border-gray-200">
      <div
        className={cn(
          "flex items-center justify-between w-full gap-4 lg:gap-6",
          className
        )}
      >
        <div className="md:flex items-center hidden gap-3">
          <label className="text-gray-500 whitespace-nowrap">
            {t("rowsPerPage")}
          </label>
          <div className="relative">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="appearance-none bg-white border border-gray-300 px-1 py-1  text-gray-600
                        focus:outline-none rounded-md 
                        hover:border-gray-400 transition-all duration-300
                        cursor-pointer min-w-12"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option} className="py-2">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute end-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        {/* <div className="text-gray-400 hidden w-full sm:block">
          {startItem}-{endItem} of {totalItems}
        </div> */}

        <div
          className={cn("flex items-center justify-center w-full lg:w-auto")}
        >
          <Pagination>
            <PaginationContent className="gap-2">
              {/* Previous Chevron */}
              <PaginationItem>
                <button
                  onClick={(e) => handlePageChange(e, currentPage - 1)}
                  disabled={isFirstPage}
                  aria-label={t("goToPreviousPage")}
                  className={cn(
                    "h-9 w-9 flex items-center justify-center rounded-md border border-transparent transition-all duration-200",
                    isFirstPage
                      ? "pointer-events-none opacity-40 cursor-not-allowed bg-gray-100"
                      : "hover:bg-gray-100 hover:border-gray-400 cursor-pointer"
                  )}
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 ltr:rotate-180" />
                </button>
              </PaginationItem>

              {/* Previous Text Button */}
              <PaginationItem>
                <button
                  onClick={(e) => handlePageChange(e, currentPage - 1)}
                  disabled={isFirstPage}
                  className={cn(
                    "h-9 px-3 flex items-center justify-center rounded-md border border-transparent text-sm font-medium transition-all duration-200",
                    isFirstPage
                      ? "pointer-events-none opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                      : "hover:bg-gray-100 hover:border-gray-400 cursor-pointer text-gray-700"
                  )}
                >
                  {t("previous")}
                </button>
              </PaginationItem>

              {/* Previous Ellipsis */}
              {isPrevDots && (
                <PaginationItem className="hidden sm:block">
                  <PaginationEllipsis className="h-9 w-9 text-gray-500" srLabel={t("morePages")} />
                </PaginationItem>
              )}

              {/* Page Number Buttons */}
              {generateArr(startPage).map((ele) => (
                <PaginationItem key={ele}>
                  <PaginationLink
                    href={"#"}
                    onClick={(e) => handlePageChange(e, ele)}
                    isActive={currentPage === ele}
                    className={cn(
                      "cursor-pointer h-9 w-9 flex items-center justify-center rounded-md border transition-all duration-200",
                      currentPage === ele
                        ? "bg-primary text-white hover:text-white hover:bg-primary/80 border-primary"
                        : "hover:bg-gray-100 border-transparent text-gray-700 hover:border-gray-400"
                    )}
                  >
                    {ele}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next Ellipsis */}
              {isAfterDots && (
                <PaginationItem className="hidden sm:block">
                  <PaginationEllipsis className="h-9 w-9 text-gray-400" srLabel={t("morePages")} />
                </PaginationItem>
              )}

              {/* Next Text Button */}
              <PaginationItem>
                <button
                  onClick={(e) => handlePageChange(e, currentPage + 1)}
                  disabled={isLastPage}
                  className={cn(
                    "h-9 px-3 flex items-center justify-center rounded-md border border-transparent text-sm font-medium transition-all duration-200",
                    isLastPage
                      ? "pointer-events-none opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                      : "hover:bg-gray-100 hover:border-gray-400 cursor-pointer text-gray-700"
                  )}
                >
                  {t("next")}
                </button>
              </PaginationItem>

              {/* Next Chevron */}
              <PaginationItem>
                <button
                  onClick={(e) => handlePageChange(e, currentPage + 1)}
                  disabled={isLastPage}
                  aria-label={t("goToNextPage")}
                  className={cn(
                    "h-9 w-9 flex items-center justify-center rounded-md border border-transparent transition-all duration-200",
                    isLastPage
                      ? "pointer-events-none opacity-40 cursor-not-allowed bg-gray-100"
                      : "hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
                  )}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 ltr:rotate-180" />
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <div className="sm:hidden w-full">
        <div className="flex items-center rounded-md justify-center gap-2 px-3 py-2 bg-primary/10 border border-primary/40">
          <span className="text-primary">
            {t("showing", { start: startItem, end: endItem, total: totalItems })}
          </span>
        </div>
      </div>
    </section>
  );
}
