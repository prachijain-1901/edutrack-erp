export declare class CreateFeePlanDto {
    name: string;
    amount: number;
    billingCycle: string;
    dueDay?: number;
    description?: string;
}
export declare class AssignFeePlanDto {
    studentId: string;
    feePlanId: string;
    dueDate: string;
}
