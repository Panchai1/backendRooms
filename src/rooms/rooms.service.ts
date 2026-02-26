import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schema/rooms.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import type { Express } from 'express';
import * as fs from 'fs'; //  นำเข้า File System เพื่อใช้ลบไฟล์
import * as path from 'path'; //  นำเข้า Path เพื่อจัดการที่อยู่ไฟล์

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(dto: CreateRoomDto, files?: Express.Multer.File[]) {   // รับข้อมูล 2 
    const imageUrls = files?.map((file) => file.filename) ?? [];   //ถ้าไม่มีรูปส่งมาจะให้เป็น Array ว่าง
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

  async update(id: string, updateRoomDto: UpdateRoomDto, files: Express.Multer.File[]): 
  Promise<Room | null> {
    const existingRoom = await this.roomModel.findById(id).exec();
    if (!existingRoom) {
      throw new NotFoundException(`Room with id ${id} not found`);    //ถ้าไม่เจอห้อง → โยน Error 404 ทันที
    }

    const updateData: any = { ...updateRoomDto };            //สร้างObject ใหม่

   
    if (files && files.length > 0) {              // 3. จัดการเรื่องรูปภาพ (ถ้ามีการส่งไฟล์ใหม่มา ให้ลบไฟล์เก่าทิ้ง)
                                                    // --- ขั้นตอนการลบไฟล์เก่าออกจากโฟลเดอร์ ---
      if (existingRoom.images && existingRoom.images.length > 0) {
        existingRoom.images.forEach((imgName) => {
          // ระบุ Path ไปยังโฟลเดอร์ที่เก็บรูป (ปกติคือ 'uploads' ที่อยู่ root ของโปรเจกต์)
          const filePath = path.join(process.cwd(), 'uploads', imgName); 
          
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath); // สั่งลบไฟล์
              console.log(`ลบไฟล์เก่าแล้ว: ${imgName}`);
            } catch (err) {
              console.error(`ไม่สามารถลบไฟล์ได้: ${imgName}`, err);
            }
          }
        });
      }

      // --- ขั้นตอนการบันทึกชื่อไฟล์ใหม่ ---
      const newImageUrls = files.map((file) => file.filename);
      updateData.images = newImageUrls; //เขียนทับ field images เดิมด้วยรูปใหม่ทั้งหมด
    }

    // 4. บันทึกข้อมูลลง Database  เเล้วคืนค่า document
    return this.roomModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string) {
    try {                                                                           //ดัก Error
      const room = await this.roomModel.findById(id).exec();
      if (!room) throw new NotFoundException(`ห้องที่มีไอดี ${id} ไม่พบ`);

      //  ลบรูปภาพออกจากเครื่องตอนลบห้องทิ้งด้วย
      if (room.images && room.images.length > 0) {                                //เช็คว่าห้องนี้มีรูปมั้ย
        room.images.forEach((imgName) => {                                       
          const filePath = path.join(process.cwd(), 'uploads', imgName);          
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);                     //เช็คว่าไฟล์มีอยู่จริงไหม
        });
      }

      await this.roomModel.findByIdAndDelete(id).exec();
      return { message: "ห้องและรูปภาพที่เกี่ยวข้องถูกลบเรียบร้อยแล้ว" };
    } catch (error) {
      throw error;
    }
  }
}