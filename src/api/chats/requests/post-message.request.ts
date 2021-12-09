import {IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import { BaseRequest } from '../../../common/base.request';

export class PostMessageRequest extends BaseRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  data: string;
}
