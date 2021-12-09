import {Response} from 'express';
import {HttpError} from '../../common/errors';
import {wrapper} from '../../tools/wrapper.helpers';
import {IEntityRequest} from '../../types';
import {MessageEntity} from '../../db/entities/message.entity';

export const deleteMessage = wrapper(async (req: IEntityRequest<MessageEntity>, res: Response) => {
    const {entity: message, user} = req;

    if (message.senderId !== user.id) {
        throw new HttpError('You can not delete message that is not yours');
    }

    await MessageEntity.remove(message);

    res.status(200).send('Message has been deleted');
});