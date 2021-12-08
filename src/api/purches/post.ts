import { Response } from 'express';
import { assign, pick } from 'lodash';
import { PurchaseEntity } from '../../db/entities/purchase.entity';
import { IRequest } from '../../types';
import { wrapper } from '../../tools/wrapper.helpers';
import { HttpError } from '../../common/errors';
import { ItemEntity } from '../../db/entities/item.entity';
import { ChatMemberEntity } from '../../db/entities/chat-member.entity';
import { Not } from 'typeorm';
import { ChatEntity } from '../../db/entities/chat.entity';

export const postPurchases = wrapper(async (req: IRequest, res: Response) => {
  const { itemId, count } = pick(req.body, 'itemId', 'count');

  const item = await ItemEntity.findOne(itemId);
  if (!item) {
    // res.status(404).send('Invalid item chosen');
    throw new HttpError('Invalid item chosen', 404);
  }
  if (item.quantity < count) {
    throw new HttpError(
      `Only ${item.quantity} items available, But you have chosen ${count}. Please check your cart`
    );
  }

  const purchase = new PurchaseEntity();

  item.quantity = item.quantity - count;
  item.save();

  assign(purchase, { item, itemQuantity: count });
  purchase.customer = req.user;

  await purchase.save();

  const customer = req.user;

  const chatMembers = await customer.chatMembers;

  const companions = await Promise.all(chatMembers.map(chatMember => {
    return  ChatMemberEntity.findOne({where: {chatId:chatMember.chatId,userId:Not(customer.id)}});
  }));

  const { sellerId } = (await purchase.item);

  const isChatExist = companions.some(chatMember => {
    if(!chatMember) {
      return false;
    }
    return chatMember.userId === sellerId;
  })

  if(!isChatExist) {
    const chat = await new ChatEntity().save();

    const chatMember1 = new ChatMemberEntity();
    const chatMember2 = new ChatMemberEntity();
    chatMember1.chat = chat;
    chatMember1.userId = customer.id;

    chatMember2.chat = chat;
    chatMember2.userId = sellerId;

    await chatMember1.save();
    await chatMember2.save();
  }

  res.status(201).send('Items has been purchased');
});
