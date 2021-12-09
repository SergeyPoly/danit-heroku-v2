import {Response} from 'express';
import {HttpError} from '../../common/errors';
import {wrapper} from '../../tools/wrapper.helpers';
import {IEntityRequest} from '../../types';
import {MessageEntity} from '../../db/entities/message.entity';
import {ChatEntity} from "../../db/entities/chat.entity";

export const createMessage = wrapper(async (req: IEntityRequest<ChatEntity>, res: Response) => {
    const {entity: chat, user} = req;
    const chatMembers = await chat.members;
    const checkChatMember = chatMembers.some(chatMember => chatMember.userId === user.id)

    if (!checkChatMember) {
        throw new HttpError('You can not send messages in chat if you are not a member');
    }

    const {data} = req.body;

    const message = new MessageEntity();
    message.chat = chat;
    message.data = data;
    message.sender = user;

    await message.save();

    res.status(200).send('Message has been created');
});