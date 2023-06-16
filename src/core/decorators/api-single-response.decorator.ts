import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SingleResponseDoc } from '../docs';

export const ApiSingleResponse = <TModel extends Type<any>>(
  model: TModel,
  status?: number,
) => {
  return applyDecorators(
    ApiExtraModels(SingleResponseDoc, model),
    ApiResponse({
      status: status ? status : 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SingleResponseDoc) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
