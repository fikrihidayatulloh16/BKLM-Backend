// src/auth/jwt.strategy.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express'; // <-- Import Request dari Express

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() { // <-- Kita tidak perlu UsersService di sini lagi
    super({
      // Di sinilah kita mendefinisikan cara mengambil token
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookie = request?.cookies?.access_token;

          if (typeof cookie === 'object' && cookie.token) {
            return cookie.token;
          }
          return cookie;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-key-just-in-case',
    });
  }

  // Fungsi validate tidak berubah sama sekali
  async validate(payload: any) {
    if (!payload.sub || !payload.school_id) {
      throw new UnauthorizedException('Token tidak valid');
    }
    return {
      id: payload.sub,
      email: payload.email,
      school_id: payload.school_id,
    };
  }
}