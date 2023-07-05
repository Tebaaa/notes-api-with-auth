import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ReqUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user ?? {};
  },
);
