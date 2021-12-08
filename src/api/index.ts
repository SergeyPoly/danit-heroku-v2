import express, { Express, json, Request, Response } from 'express';
import { HttpError } from '../common/errors';
import { files } from '../tools/files';
import { IRequest } from '../types';
import accountsRouter from './accounts/route';
import authRouter from './auth';
import { authMiddleware } from './auth/auth.middleware';
import itemsRouter from './items';
import purchasesRouter from './purches';
import chatsRouter from './chats';

export const registerRouters = (app: Express) => {
  app.use(json());
  // app.use(swagger());

  app.use(express.static('static'));
  app.get('/test', async (req: Request, res: Response) =>
    // res.redirect('/api/docs')

    res.sendFile(__dirname + '/..' + '/static' + '/index.html')
  );

  app.use('/auth', authRouter);

  app.use(files());

  app.use(authMiddleware);

  app.use('/purchases', purchasesRouter);
  app.use('/items', itemsRouter);
  app.use('/accounts', accountsRouter);
  app.use('/chats', chatsRouter);

  app.get('/chats', async (req: IRequest, res) => {
    const chats = await req.user.getChats();
    return res.send(chats);
  });

  app.use('/', (err: HttpError, req, res, next) => {
    return res.status(err?.statusCode || 400).send(err);
  });

  return app;
};
