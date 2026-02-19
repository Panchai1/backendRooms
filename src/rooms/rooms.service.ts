import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schema/rooms.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import type { Express } from 'express';


@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) { }


  // async create(dto: CreateRoomDto, file?: Express.Multer.File): Promise<Room> {
    
  //   const imageUrl = file? `room/${file.filename}`:undefined;
  //   const result = new this.roomModel({...dto, ...(imageUrl && {images: [imageUrl]})});
  //   await result.save();
  //   return result;
  // }

  async create(dto: CreateRoomDto, files?: Express.Multer.File[]) {

  const imageUrls = files?.map(file => file.filename) ?? [];

  const result = new this.roomModel({
    ...dto,
    images: imageUrls,
  });

  return result.save();
}
  async findAll(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async findOne(id: string) {
    return this.roomModel.findById(id);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room | null> {
    const result = this.roomModel.findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
    return result;
  }

  async remove(id: string) {
    try {
      const result = await this.roomModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Room with id ${id} not found`);
      }
      return { message: "Room deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

