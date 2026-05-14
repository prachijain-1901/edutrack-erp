"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentFormStepper } from "@/components/students/student-form-stepper";
import { useStudentForm } from "@/hooks/use-student-form";
import { mockBatches } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Add Student Page
// ─────────────────────────────────────────────

export default function AddStudentPage() {
  const router = useRouter();
  const form = useStudentForm();

  const handleSubmit = async () => {
    const success = await form.submitForm();
    if (success) {
      router.push("/dashboard/students");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">New Student Admission</h1>
          <p className="text-sm text-muted-foreground">
            Complete all steps to enroll a new student
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <StudentFormStepper
          steps={form.steps}
          currentStep={form.currentStep}
          onStepClick={form.goToStep}
        />
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-foreground">
            {form.steps[form.currentStep - 1]?.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {form.steps[form.currentStep - 1]?.description}
          </p>
        </div>

        {/* Step Panels */}
        {form.currentStep === 1 && (
          <Step1StudentDetails form={form} />
        )}
        {form.currentStep === 2 && (
          <Step2ParentDetails form={form} />
        )}
        {form.currentStep === 3 && (
          <Step3AcademicDetails form={form} />
        )}
        {form.currentStep === 4 && (
          <Step4BatchAssignment form={form} />
        )}
        {form.currentStep === 5 && (
          <Step5FeePlan form={form} />
        )}
        {form.currentStep === 6 && (
          <Step6Review form={form} />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-card border border-border rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between">
        <Button
          variant="outline"
          onClick={form.goToPrev}
          disabled={form.currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Step {form.currentStep} of {form.totalSteps}
          </span>
        </div>

        {form.currentStep < form.totalSteps ? (
          <Button onClick={form.goToNext} className="gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={form.isSubmitting}
            className="gap-2 min-w-32"
          >
            {form.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Enroll Student
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared Form Field Components
// ─────────────────────────────────────────────

type FormHook = ReturnType<typeof useStudentForm>;

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full px-3.5 py-2.5 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
        error ? "border-destructive focus:ring-destructive/30" : "border-border"
      )}
    />
  );
}

function SelectInput({
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full px-3.5 py-2.5 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
        error ? "border-destructive focus:ring-destructive/30" : "border-border",
        !value && "text-muted-foreground"
      )}
    >
      <option value="" disabled>
        {placeholder ?? "Select..."}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─────────────────────────────────────────────
// Step 1: Student Details
// ─────────────────────────────────────────────

function Step1StudentDetails({ form }: { form: FormHook }) {
  const { formData, errors, updateField } = form;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField label="Full Name" required error={errors.name}>
        <TextInput
          id="name"
          value={formData.name}
          onChange={(v) => updateField("name", v)}
          placeholder="Student's full name"
          error={errors.name}
        />
      </FormField>

      <FormField label="Gender" required error={errors.gender}>
        <SelectInput
          id="gender"
          value={formData.gender}
          onChange={(v) => updateField("gender", v)}
          placeholder="Select gender"
          error={errors.gender}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
        />
      </FormField>

      <FormField label="Date of Birth" required error={errors.dateOfBirth}>
        <TextInput
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(v) => updateField("dateOfBirth", v)}
          error={errors.dateOfBirth}
        />
      </FormField>

      <FormField label="Blood Group">
        <SelectInput
          id="bloodGroup"
          value={formData.bloodGroup}
          onChange={(v) => updateField("bloodGroup", v)}
          placeholder="Select blood group"
          options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
            (bg) => ({ value: bg, label: bg })
          )}
        />
      </FormField>

      <FormField label="Phone Number" required error={errors.phone}>
        <TextInput
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(v) => updateField("phone", v)}
          placeholder="10-digit mobile number"
          error={errors.phone}
        />
      </FormField>

      <FormField label="Email Address">
        <TextInput
          id="email"
          type="email"
          value={formData.email}
          onChange={(v) => updateField("email", v)}
          placeholder="student@example.com"
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Address">
          <TextInput
            id="address"
            value={formData.address}
            onChange={(v) => updateField("address", v)}
            placeholder="House/flat no., street, area"
          />
        </FormField>
      </div>

      <FormField label="City">
        <TextInput
          id="city"
          value={formData.city}
          onChange={(v) => updateField("city", v)}
          placeholder="City"
        />
      </FormField>

      <FormField label="State">
        <TextInput
          id="state"
          value={formData.state}
          onChange={(v) => updateField("state", v)}
          placeholder="State"
        />
      </FormField>

      <FormField label="Pincode">
        <TextInput
          id="pincode"
          value={formData.pincode}
          onChange={(v) => updateField("pincode", v)}
          placeholder="6-digit pincode"
        />
      </FormField>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 2: Parent Details
// ─────────────────────────────────────────────

function Step2ParentDetails({ form }: { form: FormHook }) {
  const { formData, errors, updateField } = form;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField label="Parent / Guardian Name" required error={errors.parentName}>
        <TextInput
          id="parentName"
          value={formData.parentName}
          onChange={(v) => updateField("parentName", v)}
          placeholder="Full name"
          error={errors.parentName}
        />
      </FormField>

      <FormField label="Relation" required error={errors.parentRelation}>
        <SelectInput
          id="parentRelation"
          value={formData.parentRelation}
          onChange={(v) => updateField("parentRelation", v)}
          placeholder="Select relation"
          error={errors.parentRelation}
          options={[
            { value: "father", label: "Father" },
            { value: "mother", label: "Mother" },
            { value: "guardian", label: "Guardian" },
          ]}
        />
      </FormField>

      <FormField label="Phone Number" required error={errors.parentPhone}>
        <TextInput
          id="parentPhone"
          type="tel"
          value={formData.parentPhone}
          onChange={(v) => updateField("parentPhone", v)}
          placeholder="10-digit mobile number"
          error={errors.parentPhone}
        />
      </FormField>

      <FormField label="Alternate Phone">
        <TextInput
          id="alternatePhone"
          type="tel"
          value={formData.alternatePhone}
          onChange={(v) => updateField("alternatePhone", v)}
          placeholder="10-digit mobile number"
        />
      </FormField>

      <FormField label="Email Address">
        <TextInput
          id="parentEmail"
          type="email"
          value={formData.parentEmail}
          onChange={(v) => updateField("parentEmail", v)}
          placeholder="parent@example.com"
        />
      </FormField>

      <FormField label="Occupation">
        <TextInput
          id="parentOccupation"
          value={formData.parentOccupation}
          onChange={(v) => updateField("parentOccupation", v)}
          placeholder="e.g. Engineer, Teacher, Business"
        />
      </FormField>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 3: Academic Details
// ─────────────────────────────────────────────

function Step3AcademicDetails({ form }: { form: FormHook }) {
  const { formData, errors, updateField } = form;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField label="Grade / Standard" required error={errors.grade}>
        <SelectInput
          id="grade"
          value={formData.grade}
          onChange={(v) => updateField("grade", v)}
          placeholder="Select grade"
          error={errors.grade}
          options={[
            "Class VI", "Class VII", "Class VIII", "Class IX",
            "Class X", "Class XI", "Class XII",
          ].map((g) => ({ value: g, label: g }))}
        />
      </FormField>

      <FormField label="Medium" required error={errors.medium}>
        <SelectInput
          id="medium"
          value={formData.medium}
          onChange={(v) => updateField("medium", v)}
          placeholder="Select medium"
          error={errors.medium}
          options={[
            { value: "English", label: "English" },
            { value: "Hindi", label: "Hindi" },
            { value: "Marathi", label: "Marathi" },
            { value: "Gujarati", label: "Gujarati" },
            { value: "Tamil", label: "Tamil" },
            { value: "Telugu", label: "Telugu" },
          ]}
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Previous School / College">
          <TextInput
            id="previousSchool"
            value={formData.previousSchool}
            onChange={(v) => updateField("previousSchool", v)}
            placeholder="Name of previous institution"
          />
        </FormField>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 4: Batch Assignment
// ─────────────────────────────────────────────

function Step4BatchAssignment({ form }: { form: FormHook }) {
  const { formData, errors, updateField } = form;

  const toggleBatch = (batchId: string) => {
    const current = formData.batchIds;
    if (current.includes(batchId)) {
      updateField("batchIds", current.filter((id) => id !== batchId));
    } else {
      updateField("batchIds", [...current, batchId]);
    }
  };

  return (
    <div>
      {(errors as Record<string, string>)["batchIds"] && (
        <p className="text-xs text-destructive mb-3">
          {(errors as Record<string, string>)["batchIds"]}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mockBatches.filter((b) => b.isActive).map((batch) => {
          const selected = formData.batchIds.includes(batch.id);
          return (
            <button
              key={batch.id}
              type="button"
              onClick={() => toggleBatch(batch.id)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  selected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {selected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {batch.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {batch.subject} · {batch.room}
                </p>
                <p className="text-xs text-muted-foreground">
                  {batch.teacherName} · {formatCurrency(batch.fees)}/month
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {batch.schedule.map((slot, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-muted px-1.5 py-0.5 rounded capitalize"
                    >
                      {slot.dayOfWeek.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {formData.batchIds.length > 0 && (
        <p className="text-sm text-primary mt-3">
          {formData.batchIds.length} batch
          {formData.batchIds.length > 1 ? "es" : ""} selected
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 5: Fee Plan
// ─────────────────────────────────────────────

function Step5FeePlan({ form }: { form: FormHook }) {
  const { formData, errors, updateField } = form;

  const frequencies = [
    { value: "monthly", label: "Monthly", multiplier: 1 },
    { value: "quarterly", label: "Quarterly (3 months)", multiplier: 3 },
    { value: "annual", label: "Annual (12 months)", multiplier: 12 },
  ] as const;

  const baseAmount =
    mockBatches
      .filter((b) => formData.batchIds.includes(b.id))
      .reduce((acc, b) => acc + b.fees, 0) || 5000;

  const discount = (baseAmount * (formData.discountPercent || 0)) / 100;
  const finalAmount = baseAmount - discount;

  return (
    <div className="space-y-6">
      {/* Suggested amount from selected batches */}
      {formData.batchIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            Suggested amount based on selected batches:
          </p>
          <p className="text-lg font-bold text-primary mt-0.5">
            {formatCurrency(baseAmount)} / month
          </p>
          <button
            type="button"
            className="text-xs text-primary hover:underline mt-1"
            onClick={() => updateField("feeAmount", baseAmount)}
          >
            Use this amount
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Monthly Fee Amount (₹)" required error={errors.feeAmount}>
          <TextInput
            id="feeAmount"
            type="number"
            value={formData.feeAmount ? String(formData.feeAmount) : ""}
            onChange={(v) => updateField("feeAmount", Number(v))}
            placeholder="Enter amount in rupees"
            error={errors.feeAmount}
          />
        </FormField>

        <FormField label="Discount (%)">
          <TextInput
            id="discountPercent"
            type="number"
            value={formData.discountPercent ? String(formData.discountPercent) : ""}
            onChange={(v) => updateField("discountPercent", Number(v))}
            placeholder="0"
          />
        </FormField>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Fee Frequency
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {frequencies.map((freq) => (
            <button
              key={freq.value}
              type="button"
              onClick={() => updateField("feeFrequency", freq.value)}
              className={cn(
                "p-3 rounded-xl border-2 text-left transition-all",
                formData.feeFrequency === freq.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <p className="text-sm font-semibold text-foreground">{freq.label}</p>
              {formData.feeAmount > 0 && (
                <p className="text-xs text-primary mt-0.5">
                  {formatCurrency(finalAmount * freq.multiplier)} total
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {formData.feeAmount > 0 && (
        <div className="bg-muted/50 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Fee Summary</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Amount</span>
            <span>{formatCurrency(formData.feeAmount)}</span>
          </div>
          {formData.discountPercent > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Discount ({formData.discountPercent}%)
              </span>
              <span className="text-emerald-600">
                −{formatCurrency((formData.feeAmount * formData.discountPercent) / 100)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
            <span>Final Amount</span>
            <span className="text-primary">
              {formatCurrency(
                formData.feeAmount -
                  (formData.feeAmount * formData.discountPercent) / 100
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 6: Review & Submit
// ─────────────────────────────────────────────

function Step6Review({ form }: { form: FormHook }) {
  const { formData } = form;
  const selectedBatches = mockBatches.filter((b) =>
    formData.batchIds.includes(b.id)
  );
  const finalFee =
    formData.feeAmount -
    (formData.feeAmount * formData.discountPercent) / 100;

  const sections = [
    {
      title: "Student Details",
      fields: [
        { label: "Name", value: formData.name },
        { label: "Gender", value: formData.gender },
        { label: "Date of Birth", value: formData.dateOfBirth },
        { label: "Phone", value: formData.phone },
        { label: "Email", value: formData.email || "—" },
        { label: "Blood Group", value: formData.bloodGroup || "—" },
        {
          label: "Address",
          value:
            [formData.address, formData.city, formData.state, formData.pincode]
              .filter(Boolean)
              .join(", ") || "—",
        },
      ],
    },
    {
      title: "Parent Details",
      fields: [
        { label: "Name", value: formData.parentName },
        { label: "Relation", value: formData.parentRelation },
        { label: "Phone", value: formData.parentPhone },
        { label: "Email", value: formData.parentEmail || "—" },
        { label: "Occupation", value: formData.parentOccupation || "—" },
      ],
    },
    {
      title: "Academic Details",
      fields: [
        { label: "Grade", value: formData.grade },
        { label: "Medium", value: formData.medium },
        { label: "Previous School", value: formData.previousSchool || "—" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {section.title}
          </h3>
          <div className="bg-muted/30 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {section.fields.map((field) => (
              <div key={field.label} className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-28 shrink-0 pt-0.5">
                  {field.label}
                </span>
                <span className="text-sm text-foreground capitalize">
                  {field.value || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Batches */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Assigned Batches ({selectedBatches.length})
        </h3>
        {selectedBatches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No batches selected</p>
        ) : (
          <div className="space-y-2">
            {selectedBatches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.teacherName}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatCurrency(b.fees)}/mo
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fee Summary */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Fee Plan
        </h3>
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground capitalize">
              {formData.feeFrequency} billing
            </p>
            {formData.discountPercent > 0 && (
              <p className="text-xs text-emerald-600">
                {formData.discountPercent}% discount applied
              </p>
            )}
          </div>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(finalFee)}/{formData.feeFrequency === "monthly" ? "mo" : formData.feeFrequency === "quarterly" ? "qtr" : "yr"}
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 font-medium">
          Please verify all details before submitting. Once enrolled, the student will be assigned a Roll Number automatically.
        </p>
      </div>
    </div>
  );
}
