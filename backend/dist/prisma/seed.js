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
    console.log('🌱 Seeding EduTrack database...\n');
    const password = await bcrypt.hash('Admin@123', 12);
    const teacherPwd = await bcrypt.hash('Teacher@123', 12);
    const owner = await prisma.user.upsert({
        where: { email: 'owner@edutrack.in' },
        update: {},
        create: {
            name: 'Institute Owner',
            email: 'owner@edutrack.in',
            password,
            role: client_1.Role.OWNER,
            phone: '9876500000',
            isActive: true,
        },
    });
    console.log(`✓ Owner:   ${owner.email}`);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@edutrack.in' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@edutrack.in',
            password,
            role: client_1.Role.ADMIN,
            phone: '9876500001',
            isActive: true,
        },
    });
    console.log(`✓ Admin:   ${admin.email}`);
    const existingSettings = await prisma.instituteSettings.findFirst();
    if (!existingSettings) {
        await prisma.instituteSettings.create({
            data: {
                instituteName: 'EduTrack Excellence Academy',
                email: 'contact@edutrack.in',
                phone: '9876500000',
                address: '123 Education Hub, Sector 4',
                city: 'New Delhi',
                state: 'Delhi',
                pincode: '110001',
                timezone: 'Asia/Kolkata',
                currency: 'INR',
                academicYear: '2025-2026',
            },
        });
        console.log('✓ Institute settings configured');
    }
    const t1 = await prisma.teacher.upsert({
        where: { email: 'kavita@edutrack.in' },
        update: {},
        create: {
            name: 'Dr. Kavita Joshi',
            email: 'kavita@edutrack.in',
            phone: '9876500002',
            qualification: 'M.Sc Physics, B.Ed',
            subjects: ['Physics', 'Mathematics'],
            joiningDate: new Date('2023-05-10'),
            salaryType: 'MONTHLY',
            salaryAmount: 45000,
        },
    });
    await prisma.user.upsert({
        where: { email: 'kavita@edutrack.in' },
        update: {},
        create: {
            name: 'Dr. Kavita Joshi',
            email: 'kavita@edutrack.in',
            password: teacherPwd,
            role: client_1.Role.TEACHER,
            phone: '9876500002',
            isActive: true,
        },
    });
    console.log(`✓ Teacher: kavita@edutrack.in`);
    const t2 = await prisma.teacher.upsert({
        where: { email: 'rahul@edutrack.in' },
        update: {},
        create: {
            name: 'Rahul Sharma',
            email: 'rahul@edutrack.in',
            phone: '9876500003',
            qualification: 'M.Sc Chemistry',
            subjects: ['Chemistry', 'Biology'],
            joiningDate: new Date('2024-01-15'),
            salaryType: 'MONTHLY',
            salaryAmount: 38000,
        },
    });
    await prisma.user.upsert({
        where: { email: 'rahul@edutrack.in' },
        update: {},
        create: {
            name: 'Rahul Sharma',
            email: 'rahul@edutrack.in',
            password: teacherPwd,
            role: client_1.Role.TEACHER,
            phone: '9876500003',
            isActive: true,
        },
    });
    console.log(`✓ Teacher: rahul@edutrack.in`);
    const b1 = await prisma.batch.create({
        data: {
            name: 'JEE Achievers 2026',
            subject: 'Physics',
            grade: 'Class 11',
            capacity: 40,
            roomNumber: 'A1',
            startTime: '16:00',
            endTime: '18:00',
            days: ['Monday', 'Wednesday', 'Friday'],
            status: 'ACTIVE',
            teacherId: t1.id,
        },
    });
    const b2 = await prisma.batch.create({
        data: {
            name: 'NEET Foundation',
            subject: 'Biology',
            grade: 'Class 11',
            capacity: 35,
            roomNumber: 'B2',
            startTime: '15:00',
            endTime: '17:00',
            days: ['Tuesday', 'Thursday', 'Saturday'],
            status: 'ACTIVE',
            teacherId: t2.id,
        },
    });
    console.log(`✓ Batches: ${b1.name}, ${b2.name}`);
    const feePlan = await prisma.feePlan.create({
        data: {
            name: 'Monthly Tuition',
            amount: 2500,
            billingCycle: 'MONTHLY',
            dueDay: 5,
            description: 'Standard monthly tuition fee',
        },
    });
    console.log(`✓ Fee Plan: ${feePlan.name}`);
    const studentData = [
        { first: 'Arjun', last: 'Mehta', gender: 'Male', phone: '9988776655', grade: 'Class 11', father: 'Rajesh Mehta', parentPhone: '9988776644' },
        { first: 'Sneha', last: 'Iyer', gender: 'Female', phone: '9988776656', grade: 'Class 11', father: 'Suresh Iyer', parentPhone: '9988776645' },
        { first: 'Rohit', last: 'Kumar', gender: 'Male', phone: '9988776657', grade: 'Class 12', father: 'Anil Kumar', parentPhone: '9988776646' },
        { first: 'Priya', last: 'Sharma', gender: 'Female', phone: '9988776658', grade: 'Class 11', father: 'Vikram Sharma', parentPhone: '9988776647' },
        { first: 'Aditya', last: 'Singh', gender: 'Male', phone: '9988776659', grade: 'Class 12', father: 'Ravi Singh', parentPhone: '9988776648' },
    ];
    for (const s of studentData) {
        const student = await prisma.student.create({
            data: {
                firstName: s.first,
                lastName: s.last,
                gender: s.gender,
                dob: new Date('2008-06-15'),
                grade: s.grade,
                phone: s.phone,
                address: 'New Delhi',
                parent: {
                    create: {
                        fatherName: s.father,
                        phone: s.parentPhone,
                    },
                },
            },
        });
        await prisma.studentBatch.create({
            data: { studentId: student.id, batchId: b1.id },
        });
        await prisma.studentFee.create({
            data: {
                studentId: student.id,
                feePlanId: feePlan.id,
                amount: feePlan.amount,
                dueDate: new Date(),
                status: 'PENDING',
            },
        });
    }
    console.log(`✓ ${studentData.length} students created with fees`);
    console.log('\n🎉 Seed complete!\n');
    console.log('Login credentials:');
    console.log('  Owner:   owner@edutrack.in   / Admin@123');
    console.log('  Admin:   admin@edutrack.in   / Admin@123');
    console.log('  Teacher: kavita@edutrack.in  / Teacher@123');
    console.log('  Teacher: rahul@edutrack.in   / Teacher@123');
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map