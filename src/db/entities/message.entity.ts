import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'messages' })
export class MessageEntity extends Base {
  @Column()
  public data: string;

  @Column()
  public senderId: number;

  @Column()
  public chatId: number;

  @ManyToOne(() => UserEntity)
  public sender: UserEntity;

  @ManyToOne(() => ChatEntity)
  public chat: ChatEntity;
}
