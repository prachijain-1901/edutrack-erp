"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Settings as SettingsIcon, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Plus,
  RefreshCcw,
  Search,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { whatsappService } from "@/services/whatsapp.service";
import type { MessageLog, MessageTemplate, WhatsAppStats } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WhatsAppDashboard() {
  const [activeTab, setActiveTab] = useState("logs");
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [stats, setStats] = useState<WhatsAppStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsData, templatesData, statsData] = await Promise.all([
        whatsappService.getLogs(),
        whatsappService.getTemplates(),
        whatsappService.getStats(),
      ]);
      setLogs(logsData);
      setTemplates(templatesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch WhatsApp data:", error);
      toast.error("Failed to load WhatsApp data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">WhatsApp Automation</h1>
          <p className="text-sm text-muted-foreground">Manage your communications and automated alerts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Sent" 
          value={stats?.total || 0} 
          icon={Send} 
          color="primary" 
        />
        <StatCard 
          label="Delivered" 
          value={stats?.delivered || 0} 
          icon={CheckCircle2} 
          color="success" 
        />
        <StatCard 
          label="Pending" 
          value={stats?.sent || 0} 
          icon={Clock} 
          color="warning" 
        />
        <StatCard 
          label="Failed" 
          value={stats?.failed || 0} 
          icon={AlertCircle} 
          color="danger" 
        />
      </div>

      <Tabs defaultValue="logs" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="logs">
            <FileText className="w-4 h-4 mr-2" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="templates">
            <MessageSquare className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="pt-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                  <tr>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sent At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No messages sent yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{log.recipient}</td>
                        <td className="px-4 py-3 max-w-xs truncate">{log.message}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={log.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {log.createdAt ? format(new Date(log.createdAt), "MMM d, h:mm a") : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/whatsapp/templates" className="block">
              <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors h-full">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold">Create New Template</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Define reusable messages with variables like {"{{name}}"}
                </p>
              </Card>
            </Link>
            
            {templates.map((template) => (
              <Card key={template.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground">{template.name}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {template.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 bg-muted/30 p-2 rounded-md mb-4 italic">
                    "{template.content}"
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.variables.map((v) => (
                      <span key={v} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive">Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Workflow Automation</h3>
            <div className="space-y-6">
              <AutomationToggle 
                title="Admission Welcome Message" 
                description="Automatically send a welcome WhatsApp message to new students/parents." 
                enabled={true}
              />
              <AutomationToggle 
                title="Attendance Absence Alerts" 
                description="Notify parents immediately when a student is marked absent." 
                enabled={true}
              />
              <AutomationToggle 
                title="Fee Due Reminders" 
                description="Send automated reminders 3 days before the fee due date." 
                enabled={false}
              />
              <AutomationToggle 
                title="Payment Confirmations" 
                description="Send instant digital receipts via WhatsApp after successful payment." 
                enabled={true}
              />
            </div>
            <div className="mt-8 pt-6 border-t flex justify-end">
              <Button>Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { 
  label: string; 
  value: number | string; 
  icon: any; 
  color: "primary" | "success" | "warning" | "danger" 
}) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-rose-100 text-rose-600",
  };

  return (
    <Card className="p-4 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", colors[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string, variant: "default" | "secondary" | "outline" | "destructive", className: string }> = {
    SENT: { label: "Sent", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
    DELIVERED: { label: "Delivered", variant: "default", className: "bg-emerald-500 hover:bg-emerald-600" },
    READ: { label: "Read", variant: "default", className: "bg-primary hover:bg-primary/90" },
    FAILED: { label: "Failed", variant: "destructive", className: "" },
    PENDING: { label: "Pending", variant: "secondary", className: "" },
  };

  const config = configs[status] || { label: status, variant: "outline", className: "" };

  return (
    <Badge variant={config.variant} className={cn("text-[10px] px-2 py-0.5", config.className)}>
      {config.label}
    </Badge>
  );
}

function AutomationToggle({ title, description, enabled }: { title: string, description: string, enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button 
        onClick={() => setIsEnabled(!isEnabled)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          isEnabled ? "bg-primary" : "bg-muted"
        )}
      >
        <span 
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            isEnabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
