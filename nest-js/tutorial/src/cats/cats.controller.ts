import {
  Controller,
  Get,
  // HttpCode,
  Header,
  // Redirect,
  // Query,
  Body,
  Post,
  HttpStatus,
  Res,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import JoiValidationPipe from 'src/common/pipe/joi-validation.pipe';
import { createCatSchema } from './create-cat.schema';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { getQuery } from 'src/common/decorator/get-query.decorator';

interface JSONResponse {
  test: string;
}

interface UserEntity {
  name: string;
}

@Controller('cats')
@UseInterceptors(LoggingInterceptor)
@UseGuards(RolesGuard)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get('get-json')
  // @HttpCode(204)
  @Header('Cache-Control', 'none')
  // @Redirect('https://docs.nestjs.com', 302)
  getJson(): JSONResponse {
    return {
      test: 'test2',
    };
  }

  @Get('get-Res')
  getJson1(@Res() res: Response): void {
    res.status(HttpStatus.OK).json({ test: 'test1' });
  }

  @Post()
  // @SetMetadata('roles', ['admin'])
  @Roles('admin')
  @UsePipes(new JoiValidationPipe(createCatSchema))
  // @UsePipes(ValidationPipe)
  async create(
    @Body(new ValidationPipe()) createCatDto: CreateCatDto,
  ): Promise<void> {
    this.catsService.create(createCatDto);
  }

  // 从数据库中选择一个现有的用户实体
  @Get('get-query')
  // @getQuery: 自定义装饰器
  getEuery(@getQuery('id') query: any) {
    console.log('CatsController -> getQuery -> query', query);
    return query;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id) {
    return await this.catsService.findOne(id);
  }
  // 分析验证字符串是否是 UUID.
  // @Get(':id')
  // async findOne(@Param('id', new ParseUUIDPipe()) id) {
  //   return await this.catsService.findOne(id);
  // }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
