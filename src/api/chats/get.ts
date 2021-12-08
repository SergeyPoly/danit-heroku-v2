import {Response} from 'express';
import {wrapper} from '../../tools/wrapper.helpers';
import {HttpError} from '../../common/errors';
import {IEntityRequest, IRequest} from '../../types';
import {ChatEntity} from '../../db/entities/chat.entity';

export const getMyChats = wrapper(async (req: IRequest, res: Response) => {
    const chats = await req.user.getChats();

    res.status(200).send(chats);
});

export const getChatMessages = wrapper(async (req: IEntityRequest<ChatEntity>, res: Response) => {
    const {entity: chat, user} = req;
    const chatMembers = await chat.members;
    const checkChatMember = chatMembers.some(chatMember => chatMember.userId === user.id)

    if (!checkChatMember) {
        throw new HttpError('You can not see messages from chat if you are not a member');
    }

    const messages = await chat.messages;

    res.status(200).send(messages)
});