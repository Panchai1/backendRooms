import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schema/rooms.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { RolesGuard } from 'src/auth/roles.guard';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
    ]),

  MulterModule.register({
    storage: diskStorage({
      destination: process.env.UPLOAD_DEST || './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }), 
 ],
  controllers: [RoomsController],  
  providers: [RoomsService,RolesGuard],
})
export class RoomModule {}