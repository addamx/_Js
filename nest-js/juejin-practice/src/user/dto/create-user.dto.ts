import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '123' })
  id?: string;

  @ApiProperty({ example: 'Tom' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'abc@test.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'tom' })
  @IsNotEmpty()
  username: string;
}
