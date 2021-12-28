import {Column, Entity} from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'refresh-token' })
export class RefreshTokenEntity extends Base {

  @Column()
  public expiredAt: number;

  @Column()
  public token: string;
}
