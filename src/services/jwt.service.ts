import { sign, verify } from 'jsonwebtoken';
import { pick } from 'lodash';
import { EnvConfig } from '../config';
import { UserEntity } from '../db/entities/user.entity';
import { JwtPayload } from '../types';
import {RefreshTokenEntity} from "../db/entities/refresh-token.entity";
import ms from 'ms';

class JwtService {
  decode(token: string) {
    return verify(token, EnvConfig.SECRET_KEY) as JwtPayload;
  }

  encode(data: JwtPayload | UserEntity, expire: string) {
    return sign(pick(data, 'login', 'id', 'role'), EnvConfig.SECRET_KEY, {
      expiresIn: expire,
    });
  }

  makeTokens(data: JwtPayload | UserEntity) {
    const token = this.encode(data, '4h');
    const refreshToken = this.encode(data, '8h');

    return {
      token,
      refreshToken
    }
  }

  async updateRefreshRecord(refreshToken: RefreshTokenEntity, data: string) {
    refreshToken.token = data
    refreshToken.expiredAt = Date.now() + ms('8h')
    await refreshToken.save()
  }
}

export default new JwtService();
