import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'chat_members' })
export class ChatMemberEntity extends Base {
  @Column()
  public chatId: number;

  @Column()
  public userId: number;

  @ManyToOne(() => ChatEntity)
  public chat: ChatEntity;

  @ManyToOne(() => UserEntity)
  public user: UserEntity;
}
