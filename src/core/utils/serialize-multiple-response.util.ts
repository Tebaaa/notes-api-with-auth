import { ClassConstructor, plainToInstance } from 'class-transformer';

import { MultipleResponseDoc } from '../docs';
import { PaginationDto } from '../dtos';
import { getPagination } from '.';

export const serializeMultipleResponse = <T>(
  classType: ClassConstructor<T>,
  data: unknown[],
  pagination?: PaginationDto,
  totalItems?: number,
  excludeExtraneousValues = true,
): MultipleResponseDoc<T[]> => {
  const response = {
    data: plainToInstance(classType, data, { excludeExtraneousValues }),
  };

  if (!pagination && !totalItems) {
    return response;
  }

  return {
    ...response,
    pagination: getPagination(pagination, totalItems),
  };
};
