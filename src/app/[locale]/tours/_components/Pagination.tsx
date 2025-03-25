import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const t = useTranslations("main");

  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages > 0) pageNumbers.push(1);

    if (totalPages > 5) {
      if (currentPage > 3) pageNumbers.push(-1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pageNumbers.includes(i)) pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) pageNumbers.push(-2);

      if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
    } else {
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1"
      >
        {t("prev")}
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === -1 || page === -2) {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-1">
              ...
            </span>
          );
        }
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className="px-3 py-1"
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1"
      >
        {t("next")}
      </Button>
    </div>
  );
};

export default Pagination;
