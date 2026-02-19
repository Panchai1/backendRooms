import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadGatewayException, } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  // =========================
  // 🔐 ADMIN ONLY - CREATE
  // =========================
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @Body() dto: CreateRoomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.roomsService.create(dto, files);
  }
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomsService.remove(id);
  // }
}
