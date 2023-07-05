import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { MultipleResponseDoc } from '@Core/docs';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  status?: number,
) => {
  return applyDecorators(
    ApiExtraModels(MultipleResponseDoc, model),
    ApiResponse({
      status: status ? status : 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(MultipleResponseDoc) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
