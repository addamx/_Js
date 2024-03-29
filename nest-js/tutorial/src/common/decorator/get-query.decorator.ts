import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getQuery = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    return data ? query && query[data] : query;
  },
);
