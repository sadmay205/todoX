import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

function TaskListPagination({
  handleNext,
  handlePrev,
  page,
  totalPage,
  handlePageChange,
}) {
  const generatePages = () => {
    if (totalPage <= 5) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    const pages = [1];

    if (page > 3) {
      pages.push("...");
    }

    let start = Math.max(2, page - 1);
    let end = Math.min(totalPage - 1, page + 1);

    if (page <= 3) {
      start = 2;
      end = 4;
    } else if (page >= totalPage - 2) {
      start = totalPage - 3;
      end = totalPage - 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPage - 2) {
      pages.push("...");
    }

    if (totalPage > 1) {
      pages.push(totalPage);
    }

    return pages;
  };

  const pageToShow = generatePages();

  if (totalPage <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          {/* {Previous} */}
          <PaginationItem>
            <PaginationPrevious
              onClick={page <= 1 ? undefined : handlePrev}
              className={cn(
                "cursor-pointer select-none",
                page <= 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {/* {Number pages} */}
          {pageToShow.map((p, index) => (
            <PaginationItem key={index}>
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (p !== page) handlePageChange(p);
                  }}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* {Next} */}
          <PaginationItem>
            <PaginationNext
              onClick={page >= totalPage ? undefined : handleNext}
              className={cn(
                "cursor-pointer select-none",
                page >= totalPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default TaskListPagination;
