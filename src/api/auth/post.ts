import { Request, Response } from 'express';
import { assign, pick } from 'lodash';
import ms from 'ms';
import { UserEntity } from '../../db/entities/user.entity';
import JwtService from '../../services/jwt.service';
import { wrapper } from '../../tools/wrapper.helpers';
import { HttpError } from '../../common/errors';
import {RefreshTokenEntity} from "../../db/entities/refresh-token.entity";

export const registration = wrapper(async (req: Request, res: Response) => {
  const data = pick(req.body, 'login', 'password', 'role');

  const isLoginInUse = !!(await UserEntity.findOne({ login: data.login }));

  if (isLoginInUse) {
    throw new HttpError('Aaaa');
  }

  const user = new UserEntity();
  assign(user, data);

  await user.save();
  res.status(201).send(`User with id ${user.id} created!`);
});

export const login = async (req: Request, res: Response) => {
  const { password, login } = pick(req.body, 'password', 'login');
  const user = await UserEntity.findOne(
    { login },
    { select: ['password', 'id', 'role', 'login'] }
  );

  if (!user || !user.verifyPassword(password)) {
    return res.status(400).send('I dont know you bro');
  }

  const tokens = JwtService.makeTokens(user)
  const refreshToken = new RefreshTokenEntity()
  await JwtService.updateRefreshRecord(refreshToken, tokens.refreshToken)

  return res.send({ tokens });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: tokenFromRequest } = req.body;

  if (!tokenFromRequest) {
    return res.status(400).send('Refresh token not found in request');
  }

  try {
    const user = JwtService.decode(tokenFromRequest);

    if (!user) {
      return res.status(400).send('User not found');
    }

    const refreshToken = await RefreshTokenEntity.findOne({ where: { token: tokenFromRequest } })

    if (refreshToken.expiredAt <= Date.now()) {
      return res.status(400).send('Refresh token has been expired');
    }

    const tokens = JwtService.makeTokens(user)
    await JwtService.updateRefreshRecord(refreshToken, tokens.refreshToken)
    return res.send({ tokens });

  } catch (err) {
    return res.status(401).send('Invalid Token');
  }

}