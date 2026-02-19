import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schema/booking.schema';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { use } from 'passport';

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
      throw new BadRequestException('Time slot already booked');
    }

    return this.bookingModel.create({ ...dto, user: UserId });
  } // ✅ ปิด create ให้ครบ

  // findAll() {
  //   return this.bookingModel.find().populate('user').populate('room');
  // }

  async findAll(user: any) {
    // 🔥 ถ้าเป็น admin → เห็นทั้งหมด
    if (user.role === 'admin') {
      return this.bookingModel.find().populate('user').populate('room');
    }

    // 🔥 ถ้าเป็น user → เห็นเฉพาะของตัวเอง
    return this.bookingModel
      .find({ user: user.userId })
      .populate('user')
      .populate('room');
  }
  findOne(id: string) {
    return this.bookingModel.findById(id);
  }

  update(id: string, updateBookingDto: UpdateBookingDto) {
    return this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true });
  }

  // remove(id: string) {
  //   return this.bookingModel.findByIdAndDelete(id);
  // }
  async remove(id: string, user: any) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 🔥 ถ้าไม่ใช่ admin และไม่ใช่เจ้าของ → ห้ามลบ
    if (
      user.role !== 'admin' &&
      booking.user.toString() !== user.userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.bookingModel.findByIdAndDelete(id);
  }

}