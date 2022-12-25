import { MSG_TYPE, RECEIVE_TYPE } from '@/helper/feishu/user';
import { ApiProperty } from '@nestjs/swagger';

export class FeishuMessageDto {
  @ApiProperty({ example: 'email' })
  receive_id_type: RECEIVE_TYPE;

  @ApiProperty({ example: 'cookieboty@qq.com' })
  receive_id?: string;

  @ApiProperty({ example: `{\"text\":\"test content\"}` })
  content?: string;

  @ApiProperty({ example: 'text', enum: MSG_TYPE })
  msg_type?: keyof MSG_TYPE;
}
