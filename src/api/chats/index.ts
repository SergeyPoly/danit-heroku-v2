import {Router} from 'express';
import {validationMiddleware} from '../../tools/wrapper.helpers';
import {getChatMessages, getMyChats} from "./get";
import {checkEntityId} from '../../tools/wrapper.helpers';
import {ChatEntity} from "../../db/entities/chat.entity";
import {MessageEntity} from "../../db/entities/message.entity";
import {deleteMessage} from "./delete";
import {createMessage} from "./post";
import {PostMessageRequest} from './requests/post-message.request';

const router = Router();

router.get('/', getMyChats);
router.get('/:id/messages', checkEntityId(ChatEntity), getChatMessages);
router.post('/:id/messages', checkEntityId(ChatEntity), validationMiddleware(PostMessageRequest), createMessage);
router.delete('/:chatId/messages/:id', checkEntityId(MessageEntity), deleteMessage);

export default router;
