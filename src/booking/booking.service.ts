import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schema/booking.schema';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { use } from 'passport';
import { exec } from 'child_process';

@Injectable()
export class BookingService {

  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) { }
  async create(dto: CreateBookingDto, UserId: string) {

    const conflict = await this.bookingModel.findOne({
      room: dto.room,
      date: dto.date,
      startTime: { $lt: dto.endTime },
      endTime: { $gt: dto.startTime },
    });

    if (conflict) {
      throw new BadRequestException('ช่วงเวลาที่ถูกจองไว้แล้ว');
    }

    return this.bookingModel.create({ ...dto, user: UserId });
  }

  async findAll(user: any) {
    // 🔥 ถ้าเป็น admin → เห็นทั้งหมด
    const query = user.role === 'admin' ? {} : { user: user.userId };
    if (user.role === 'admin') {
      return this.bookingModel.find().populate('user','name').populate('room');
    }

    // 🔥 ถ้าเป็น user → เห็นเฉพาะของตัวเอง
    return this.bookingModel
      .find({ user: user.userId })
      .populate('user','name email')
      .populate('room','username name')
      .exec();
  }
   


  async findOne(id: string) {
    const booking = await this.bookingModel.findById(id).populate('user','name').populate('room','name');
    if (!booking) {
      throw new NotFoundException('ไม่พบการจอง');
    }
    return booking;
  }


  update(id: string, updateBookingDto: UpdateBookingDto) {
    return this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true });
  }


  async remove(id: string, user: any) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('ไม่พบการจอง');
    }

    //  ถ้าไม่ใช่ admin และไม่ใช่เจ้าของ → ห้ามลบ
    if (
      user.role !== 'admin' &&
      booking.user.toString() !== user.userId
    ) {
      throw new ForbiddenException('การเข้าถึงถูกปฏิเสธ');
    }

    return this.bookingModel.findByIdAndDelete(id);
  }

}