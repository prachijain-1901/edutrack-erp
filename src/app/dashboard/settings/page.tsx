"use client";

import { useEffect, useState } from "react";
import {
  School,
  Bell,
  CreditCard,
  CalendarCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { settingsService } from "@/services/settings.service";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "institute", label: "Institute Profile", icon: School },
  { id: "attendance", label: "Attendance Rules", icon: CalendarCheck },
  { id: "fees", label: "Fee Configuration", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("institute");
  
  // States
  const [institute, setInstitute] = useState<any>({});
  const [attendance, setAttendance] = useState<any>({});
  const [fees, setFees] = useState<any>({});
  const [notifications, setNotifications] = useState<any>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const [inst, att, fee, notif] = await Promise.all([
          settingsService.getInstituteSettings(),
          settingsService.getAttendanceSettings(),
          settingsService.getFeeSettings(),
          settingsService.getNotificationSettings(),
        ]);
        setInstitute(inst.data || inst);
        setAttendance(att.data || att);
        setFees(fee.data || fee);
        setNotifications(notif.data || notif);
      } catch (e) {
        showToast("Failed to load settings", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const showToast = (message: string, type: 'success'|'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'institute') await settingsService.updateInstituteSettings(institute);
      if (activeTab === 'attendance') await settingsService.updateAttendanceSettings(attendance);
      if (activeTab === 'fees') await settingsService.updateFeeSettings(fees);
      if (activeTab === 'notifications') await settingsService.updateNotificationSettings(notifications);
      
      showToast("Settings saved successfully", "success");
      setHasUnsavedChanges(false);
    } catch (e) {
      showToast("Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (setter: any) => (e: any) => {
    const { name, value, type, checked } = e.target;
    setter((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <PageHeader
        title="Settings & Configuration"
        description="Manage your institute preferences, branding, and operational rules."
      />

      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-4",
          toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-destructive text-white"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (hasUnsavedChanges && !confirm("You have unsaved changes. Discard?")) return;
                    setActiveTab(tab.id);
                    setHasUnsavedChanges(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-2xl p-6 shadow-sm">
          
          {/* INSTITUTE SETTINGS */}
          {activeTab === 'institute' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Institute Profile</h3>
                <p className="text-sm text-muted-foreground">Basic information and contact details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Institute Name</label>
                  <input type="text" name="instituteName" value={institute.instituteName || ''} onChange={handleChange(setInstitute)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input type="email" name="email" value={institute.email || ''} onChange={handleChange(setInstitute)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Primary Phone</label>
                  <input type="text" name="phone" value={institute.phone || ''} onChange={handleChange(setInstitute)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Full Address</label>
                  <textarea name="address" rows={3} value={institute.address || ''} onChange={handleChange(setInstitute)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Timezone</label>
                  <select name="timezone" value={institute.timezone || 'Asia/Kolkata'} onChange={handleChange(setInstitute)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Academic Year</label>
                  <input type="text" name="academicYear" value={institute.academicYear || ''} onChange={handleChange(setInstitute)} placeholder="e.g. 2025-2026" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE SETTINGS */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Attendance Rules</h3>
                <p className="text-sm text-muted-foreground">Configure how attendance is tracked and penalized.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Minimum Attendance %</label>
                  <input type="number" name="minimumAttendancePercentage" value={attendance.minimumAttendancePercentage || 0} onChange={handleChange(setAttendance)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                  <p className="text-xs text-muted-foreground mt-1">Triggers low attendance warnings below this.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Auto-Absent After (Mins)</label>
                  <input type="number" name="autoAbsentAfterMinutes" value={attendance.autoAbsentAfterMinutes || 0} onChange={handleChange(setAttendance)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                  <p className="text-xs text-muted-foreground mt-1">Minutes late before marked absent.</p>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-xl md:col-span-2">
                  <div>
                    <p className="font-medium text-sm">Allow Late Marking</p>
                    <p className="text-xs text-muted-foreground">Permit teachers to mark students as LATE.</p>
                  </div>
                  <input type="checkbox" name="allowLateMarking" checked={attendance.allowLateMarking || false} onChange={handleChange(setAttendance)} className="w-4 h-4 accent-primary" />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-xl md:col-span-2">
                  <div>
                    <p className="font-medium text-sm">Notify Parents on Low Attendance</p>
                    <p className="text-xs text-muted-foreground">Automatically send alerts when attendance drops below threshold.</p>
                  </div>
                  <input type="checkbox" name="notifyLowAttendance" checked={attendance.notifyLowAttendance || false} onChange={handleChange(setAttendance)} className="w-4 h-4 accent-primary" />
                </div>
              </div>
            </div>
          )}

          {/* FEE SETTINGS */}
          {activeTab === 'fees' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Fee Configuration</h3>
                <p className="text-sm text-muted-foreground">Manage payment behaviors and auto-generation rules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Default Due Day of Month</label>
                  <input type="number" min="1" max="28" name="defaultDueDay" value={fees.defaultDueDay || 5} onChange={handleChange(setFees)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                  <p className="text-xs text-muted-foreground mt-1">e.g., entering 5 means fees are due on the 5th of every month.</p>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-xl md:col-span-2">
                  <div>
                    <p className="font-medium text-sm">Enable Partial Payments</p>
                    <p className="text-xs text-muted-foreground">Allow students to pay fees in smaller installments.</p>
                  </div>
                  <input type="checkbox" name="enablePartialPayments" checked={fees.enablePartialPayments || false} onChange={handleChange(setFees)} className="w-4 h-4 accent-primary" />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-xl md:col-span-2">
                  <div>
                    <p className="font-medium text-sm">Overdue Penalty</p>
                    <p className="text-xs text-muted-foreground">Automatically apply late fees to overdue invoices.</p>
                  </div>
                  <input type="checkbox" name="overduePenaltyEnabled" checked={fees.overduePenaltyEnabled || false} onChange={handleChange(setFees)} className="w-4 h-4 accent-primary" />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Select how the system should communicate with users.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Send transactional emails to students and parents.</p>
                  </div>
                  <input type="checkbox" name="emailNotifications" checked={notifications.emailNotifications || false} onChange={handleChange(setNotifications)} className="w-4 h-4 accent-primary" />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                  <div>
                    <p className="font-medium text-sm">SMS Integration</p>
                    <p className="text-xs text-muted-foreground">Send text messages (requires active gateway API key).</p>
                  </div>
                  <input type="checkbox" name="smsNotifications" checked={notifications.smsNotifications || false} onChange={handleChange(setNotifications)} className="w-4 h-4 accent-primary" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                  <div>
                    <p className="font-medium text-sm">Automated Fee Reminders</p>
                    <p className="text-xs text-muted-foreground">Send reminders 3 days before due date.</p>
                  </div>
                  <input type="checkbox" name="feeAlerts" checked={notifications.feeAlerts || false} onChange={handleChange(setNotifications)} className="w-4 h-4 accent-primary" />
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Sticky Save Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-card border-t border-border p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] flex items-center justify-between animate-in slide-in-from-bottom-full z-30">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.reload()} disabled={isSaving}>Discard</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
