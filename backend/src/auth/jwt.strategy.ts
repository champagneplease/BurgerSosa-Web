import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretkey_para_desarrollo_cambiar_en_produccion',
    });
  }

  async validate(payload: any) {
    // This payload is what we signed in auth.service.ts
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
