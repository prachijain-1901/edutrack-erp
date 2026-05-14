"use client";

import {
  MoreHorizontal,
  Pencil,
  ArrowLeftRight,
  PowerOff,
  MessageSquare,
  IndianRupee,
  CalendarCheck,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Student } from "@/types";

// ─────────────────────────────────────────────
// Student Actions Dropdown
// ─────────────────────────────────────────────

interface StudentActionsDropdownProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onTransferBatch?: (student: Student) => void;
  onToggleStatus?: (student: Student) => void;
  onSendMessage?: (student: Student) => void;
  onRecordPayment?: (student: Student) => void;
  onViewAttendance?: (student: Student) => void;
  onViewProfile?: (student: Student) => void;
  align?: "start" | "end";
}

export function StudentActionsDropdown({
  student,
  onEdit,
  onTransferBatch,
  onToggleStatus,
  onSendMessage,
  onRecordPayment,
  onViewAttendance,
  onViewProfile,
  align = "end",
}: StudentActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions for {student.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          {student.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {onViewProfile && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(student);
            }}
            className="gap-2"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
            View Profile
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit(student);
            }}
            className="gap-2"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
            Edit Details
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {onTransferBatch && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onTransferBatch(student);
            }}
            className="gap-2"
          >
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
            Transfer Batch
          </DropdownMenuItem>
        )}

        {onViewAttendance && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onViewAttendance(student);
            }}
            className="gap-2"
          >
            <CalendarCheck className="w-4 h-4 text-muted-foreground" />
            View Attendance
          </DropdownMenuItem>
        )}

        {onRecordPayment && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRecordPayment(student);
            }}
            className="gap-2"
          >
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
            Record Payment
          </DropdownMenuItem>
        )}

        {onSendMessage && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onSendMessage(student);
            }}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Send Message
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {onToggleStatus && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(student);
            }}
            className={`gap-2 ${
              student.isActive
                ? "text-destructive focus:text-destructive"
                : "text-emerald-600 focus:text-emerald-600"
            }`}
          >
            <PowerOff className="w-4 h-4" />
            {student.isActive ? "Mark Inactive" : "Reactivate"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
