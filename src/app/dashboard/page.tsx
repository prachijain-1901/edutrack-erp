"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  IndianRupee,
  Activity,
  CreditCard,
  AlertTriangle,
  Megaphone,
  UserPlus,
  CalendarCheck,
  ChevronRight,
  TrendingUp,
  Loader2
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";
import { Counter } from "@/components/ui/counter";

export default function OwnerDashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [students, setStudents] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [overviewRes, revRes, attRes, stuRes, alertsRes] = await Promise.all([
          dashboardService.getOverview().catch(() => null),
          dashboardService.getRevenue().catch(() => null),
          dashboardService.getAttendance().catch(() => null),
          dashboardService.getStudents().catch(() => null),
          dashboardService.getAlerts().catch(() => null),
        ]);
        
        setOverview(overviewRes?.data || overviewRes);
        setRevenue(revRes?.data || revRes);
        setAttendance(attRes?.data || attRes);
        setStudents(stuRes?.data || stuRes);
        setAlerts(alertsRes?.data || alertsRes || []);
      } catch (error) {
        console.error("Dashboard failed to load", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();

    // ─── Realtime Listener ───
    const handleUpdate = (event: any) => {
      console.log("Realtime Dashboard Update Triggered:", event.detail.type);
      loadDashboard(); // Re-fetch data on any relevant update
    };

    window.addEventListener("erp:dashboard_update", handleUpdate);
    return () => window.removeEventListener("erp:dashboard_update", handleUpdate);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading Business Analytics...</p>
      </div>
    );
  }

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Business Overview"
        description="Monitor your institute's key performance indicators and operational alerts."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href="/dashboard/students/new">
                <UserPlus className="w-4 h-4" /> Add Student
              </Link>
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link href="/dashboard/fees/pending">
                <IndianRupee className="w-4 h-4" /> Collect Fees
              </Link>
            </Button>
          </div>
        }
      />

      {/* ─── Alerts Panel ─── */}
      {alerts && alerts.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Action Required</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((alert: any) => (
              <div key={alert.id} className="bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-border flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">View</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Students" 
          value={<Counter value={overview?.totalStudents || 0} />} 
          subtitle={`${students?.active || 0} active`} 
          icon={Users} 
          color="text-blue-600 bg-blue-100" 
        />
        <KPICard 
          title="Monthly Revenue" 
          value={<Counter value={overview?.revenue || 0} prefix="₹" />} 
          subtitle="Collected this month" 
          icon={IndianRupee} 
          color="text-emerald-600 bg-emerald-100" 
        />
        <KPICard 
          title="Pending Dues" 
          value={<Counter value={overview?.pendingFees || 0} prefix="₹" />} 
          subtitle="Across all students" 
          icon={CreditCard} 
          color="text-rose-600 bg-rose-100" 
        />
        <KPICard 
          title="Attendance" 
          value={<Counter value={overview?.attendancePercent || 0} suffix="%" />} 
          subtitle="Today's average" 
          icon={Activity} 
          color="text-amber-600 bg-amber-100" 
        />
      </div>

      {/* ─── Analytics Charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Trends</h3>
              <p className="text-xs text-muted-foreground">Monthly collection vs expected</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div> Collected</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div> Expected</span>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue?.trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                />
                <Area type="monotone" dataKey="expected" stroke="hsl(var(--muted-foreground)/0.3)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Pie */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-1">Fee Collections</h3>
          <p className="text-xs text-muted-foreground mb-6">Distribution of billed amounts</p>
          <div className="h-[200px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenue?.feeCollectionPie || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(revenue?.feeCollectionPie || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{formatCurrency(revenue?.totalRevenue || 0)}</span>
              <span className="text-[10px] text-muted-foreground uppercase">Collected</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {(revenue?.feeCollectionPie || []).map((item: any, i: number) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </span>
                <span className="font-medium text-foreground">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Trend Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Attendance Trends</h3>
              <p className="text-xs text-muted-foreground">Percentage of students present over the last 5 days</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance?.trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: any) => [`${Number(value) || 0}%`, 'Present']}
                />
                <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <QuickAction href="/dashboard/students/new" icon={UserPlus} title="Admit Student" desc="Enroll a new student" color="bg-blue-100 text-blue-600" />
            <QuickAction href="/dashboard/attendance/mark" icon={CalendarCheck} title="Mark Attendance" desc="Record today's attendance" color="bg-emerald-100 text-emerald-600" />
            <QuickAction href="/dashboard/fees/pending" icon={CreditCard} title="Record Payment" desc="Log received fee amounts" color="bg-purple-100 text-purple-600" />
            <QuickAction href="/dashboard/announcements" icon={Megaphone} title="Broadcast Message" desc="Send an announcement" color="bg-amber-100 text-amber-600" />
          </div>
        </div>

      </div>
    </div>
  );
}

function KPICard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-foreground tracking-tight">{value}</h4>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, desc, color }: any) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}
