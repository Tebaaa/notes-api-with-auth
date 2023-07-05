import { ClassConstructor, plainToInstance } from 'class-transformer';

import { SingleResponseDoc } from '../docs';

export const serializeSingleResponse = <T>(
  classType: ClassConstructor<T>,
  data: unknown,
  excludeExtraneousValues = true,
): SingleResponseDoc<T> => {
  return {
    data: plainToInstance(classType, data, { excludeExtraneousValues }),
  };
};
