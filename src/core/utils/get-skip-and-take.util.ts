import { PaginationDto } from '../dtos';

export const getSkipAndTake = (
  pagination: PaginationDto,
): { take: number; skip: number } => {
  if (!pagination.items) {
    return { take: 20, skip: 0 };
  }
  return {
    take: pagination.items,
    skip: (pagination.page - 1) * pagination.items,
  };
};
