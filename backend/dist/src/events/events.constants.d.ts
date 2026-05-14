export declare const ERP_EVENTS: {
    readonly STUDENT: {
        readonly CREATED: "student.created";
        readonly UPDATED: "student.updated";
        readonly DELETED: "student.deleted";
    };
    readonly ATTENDANCE: {
        readonly MARKED: "attendance.marked";
        readonly LOW: "attendance.low";
        readonly ABSENT: "attendance.absent";
    };
    readonly FEE: {
        readonly PAYMENT_RECEIVED: "fee.payment.received";
        readonly OVERDUE: "fee.overdue";
        readonly REMINDER: "fee.reminder";
    };
    readonly BATCH: {
        readonly CREATED: "batch.created";
    };
    readonly ANNOUNCEMENT: {
        readonly CREATED: "announcement.created";
    };
};
export type ErpEventType = typeof ERP_EVENTS;
