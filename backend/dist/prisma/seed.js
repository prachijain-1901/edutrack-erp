"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...\n');
    const ownerPassword = await bcrypt.hash('Admin@123', 12);
    const owner = await prisma.user.upsert({
        where: { email: 'owner@edutrack.in' },
        update: {},
        create: {
            name: 'Institute Owner',
            email: 'owner@edutrack.in',
            password: ownerPassword,
            role: client_1.Role.OWNER,
            phone: '9876500000',
            isActive: true,
        },
    });
    console.log(`✓ Owner:   ${owner.email}  [Role: ${owner.role}]`);
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@edutrack.in' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@edutrack.in',
            password: adminPassword,
            role: client_1.Role.ADMIN,
            phone: '9876500001',
            isActive: true,
        },
    });
    console.log(`✓ Admin:   ${admin.email}  [Role: ${admin.role}]`);
    const teacherPassword = await bcrypt.hash('Teacher@123', 12);
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@edutrack.in' },
        update: {},
        create: {
            name: 'Dr. Kavita Joshi',
            email: 'teacher@edutrack.in',
            password: teacherPassword,
            role: client_1.Role.TEACHER,
            phone: '9876500002',
            isActive: true,
        },
    });
    console.log(`✓ Teacher: ${teacher.email}  [Role: ${teacher.role}]`);
    console.log('\n🎉 Seed complete!');
    console.log('\nLogin credentials:');
    console.log('  Owner:   owner@edutrack.in   / Admin@123');
    console.log('  Admin:   admin@edutrack.in   / Admin@123');
    console.log('  Teacher: teacher@edutrack.in / Teacher@123');
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map