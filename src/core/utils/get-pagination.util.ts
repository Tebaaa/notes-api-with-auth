import { PaginationDoc } from '../docs';
import { PaginationDto } from '../dtos';

export const getPagination = (
  pagination: PaginationDto,
  totalItems: number,
): PaginationDoc => {
  const totalPages = Math.ceil(totalItems / pagination.items);
  const nextPage = pagination.page < totalPages ? pagination.page + 1 : null;
  const previousPage =
    pagination.page > 1 && pagination.page <= totalPages
      ? pagination.page - 1
      : null;

  return {
    current_page: pagination.page,
    items_per_page: pagination.items,
    total_items: totalItems,
    total_pages: totalPages,
    previous_page: previousPage,
    next_page: nextPage,
  };
};
