export const ERP_EVENTS = {
  STUDENT: {
    CREATED: 'student.created',
    UPDATED: 'student.updated',
    DELETED: 'student.deleted',
  },
  ATTENDANCE: {
    MARKED: 'attendance.marked',
    LOW: 'attendance.low',
    ABSENT: 'attendance.absent',
  },
  FEE: {
    PAYMENT_RECEIVED: 'fee.payment.received',
    OVERDUE: 'fee.overdue',
    REMINDER: 'fee.reminder',
  },
  BATCH: {
    CREATED: 'batch.created',
  },
  ANNOUNCEMENT: {
    CREATED: 'announcement.created',
  },
} as const;

export type ErpEventType = typeof ERP_EVENTS;
