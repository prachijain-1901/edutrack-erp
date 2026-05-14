"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchesController = void 0;
const common_1 = require("@nestjs/common");
const batches_service_1 = require("./batches.service");
const batch_dto_1 = require("./dto/batch.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
let BatchesController = class BatchesController {
    batchesService;
    constructor(batchesService) {
        this.batchesService = batchesService;
    }
    create(createBatchDto) {
        return this.batchesService.create(createBatchDto);
    }
    findAll(skip, take, search, status, teacherId) {
        return this.batchesService.findAll({
            skip: skip ? parseInt(skip, 10) : undefined,
            take: take ? parseInt(take, 10) : undefined,
            search,
            status,
            teacherId,
        });
    }
    findOne(id) {
        return this.batchesService.findOne(id);
    }
    update(id, updateBatchDto) {
        return this.batchesService.update(id, updateBatchDto);
    }
    remove(id) {
        return this.batchesService.remove(id);
    }
    assignStudent(id, studentId) {
        return this.batchesService.assignStudent(id, studentId);
    }
    removeStudent(id, studentId) {
        return this.batchesService.removeStudent(id, studentId);
    }
};
exports.BatchesController = BatchesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_dto_1.CreateBatchDto]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, batch_dto_1.UpdateBatchDto]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/students'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "assignStudent", null);
__decorate([
    (0, common_1.Delete)(':id/students/:studentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "removeStudent", null);
exports.BatchesController = BatchesController = __decorate([
    (0, common_1.Controller)('batches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [batches_service_1.BatchesService])
], BatchesController);
//# sourceMappingURL=batches.controller.js.map