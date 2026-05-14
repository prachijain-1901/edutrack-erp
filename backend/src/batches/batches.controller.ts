import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto, UpdateBatchDto } from './dto/batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BatchStatus } from '@prisma/client';

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchesService.create(createBatchDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('status') status?: BatchStatus,
    @Query('teacherId') teacherId?: string,
  ) {
    return this.batchesService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      search,
      status,
      teacherId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.update(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchesService.remove(id);
  }

  @Post(':id/students')
  assignStudent(@Param('id') id: string, @Body('studentId') studentId: string) {
    return this.batchesService.assignStudent(id, studentId);
  }

  @Delete(':id/students/:studentId')
  removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.batchesService.removeStudent(id, studentId);
  }
}
