// src/auth/decorators/get-user.decorators.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthenticatedUser = {
    id: string;
    email: string;
    school_id: string;
};

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user; // Ambil 'user' yang di-inject oleh JwtStrategy
    },
);