"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Plus, 
  Save, 
  Trash2, 
  Eye, 
  Info,
  Variable
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { whatsappService } from "@/services/whatsapp.service";
import type { MessageTemplate } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TemplateManagement() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    type: "TRANSACTIONAL",
    variables: [] as string[]
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await whatsappService.getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Extract variables from content if any
      const variableMatches = formData.content.match(/{{(.*?)}}/g);
      const variables = variableMatches 
        ? variableMatches.map(v => v.replace(/{{|}}/g, "")) 
        : [];

      await whatsappService.createTemplate({
        ...formData,
        variables
      });
      toast.success("Template created successfully");
      setIsAdding(false);
      fetchTemplates();
      setFormData({ name: "", content: "", type: "TRANSACTIONAL", variables: [] });
    } catch (error: any) {
      toast.error(error.message || "Failed to create template");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/whatsapp">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Message Templates</h1>
            <p className="text-sm text-muted-foreground">Define reusable message structures for automation.</p>
          </div>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="p-6 max-w-2xl border-primary/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-semibold mb-4">Create New Template</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Template Name</label>
              <input 
                type="text" 
                placeholder="e.g. WELCOME_STUDENT"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase().replace(/\s/g, "_")})}
                required
              />
              <p className="text-[10px] text-muted-foreground mt-1 uppercase">UPPERCASE_WITH_UNDERSCORES only.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select 
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="TRANSACTIONAL">Transactional (Alerts, Reminders)</option>
                <option value="PROMOTIONAL">Promotional (Offers, Events)</option>
                <option value="OTP">OTP (Security)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium">Message Content</label>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {"{{variable}}"} supported
                </Badge>
              </div>
              <textarea 
                placeholder="Hello {{name}}, welcome to EduTrack! Your roll number is {{roll_no}}."
                className="w-full h-32 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-border">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                <Eye className="w-3 h-3" />
                WHATSAPP PREVIEW
              </div>
              <div className="bg-[#E7FFDB] text-[#111B21] p-3 rounded-lg rounded-tl-none shadow-sm text-sm relative max-w-[85%] border-l-4 border-l-[#25D366]">
                {formData.content || "Type your message above to see a preview..."}
                <span className="text-[9px] text-[#667781] block mt-1 text-right">10:00 AM</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="group overflow-hidden transition-all hover:shadow-md">
            <div className="p-5 border-b border-border bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Updated on {format(new Date(template.updatedAt || template.createdAt), "MMM d, yyyy")}</p>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                  {template.type}
                </Badge>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg border border-border italic text-sm text-foreground/80 min-h-[80px]">
                "{template.content}"
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                  <Variable className="w-3 h-3" />
                  Dynamic Variables
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {template.variables.length > 0 ? (
                    template.variables.map((v) => (
                      <span key={v} className="bg-primary/5 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/10 font-mono">
                        {v}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">No variables</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Test Send
                </Button>
                <Button variant="outline" size="sm" className="px-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !isAdding && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border rounded-2xl">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No Templates Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Get started by creating your first message template for automated alerts.
          </p>
          <Button className="mt-6" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      )}
    </div>
  );
}

function format(date: Date, formatStr: string) {
  // Simple mock of date-fns format if needed, but we installed date-fns
  const { format: dfnsFormat } = require("date-fns");
  return dfnsFormat(date, formatStr);
}
