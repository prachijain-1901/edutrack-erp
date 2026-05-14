"use client";

import { useState, useCallback } from "react";
import type { StudentFormData } from "@/types";
import { studentService } from "@/services/student.service";

// ─────────────────────────────────────────────
// Multi-step form hook
// ─────────────────────────────────────────────

export const STUDENT_FORM_STEPS = [
  { id: 1, title: "Student Details", description: "Personal information" },
  { id: 2, title: "Parent Details", description: "Guardian information" },
  { id: 3, title: "Academic Details", description: "School & grade info" },
  { id: 4, title: "Batch Assignment", description: "Assign to batches" },
  { id: 5, title: "Fee Plan", description: "Set fee structure" },
  { id: 6, title: "Review & Submit", description: "Confirm details" },
] as const;

const INITIAL_FORM: StudentFormData = {
  name: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  bloodGroup: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  parentName: "",
  parentRelation: "",
  parentPhone: "",
  parentEmail: "",
  parentOccupation: "",
  alternatePhone: "",
  grade: "",
  medium: "",
  previousSchool: "",
  batchIds: [],
  feeAmount: 0,
  feeFrequency: "monthly",
  discountPercent: 0,
};

export function useStudentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = STUDENT_FORM_STEPS.length;

  const updateField = useCallback(
    <K extends keyof StudentFormData>(key: K, value: StudentFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear error on change
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    },
    [errors]
  );

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

      if (step === 1) {
        if (!formData.name.trim()) newErrors.name = "Student name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone))
          newErrors.phone = "Enter a valid 10-digit phone number";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
      }

      if (step === 2) {
        if (!formData.parentName.trim())
          newErrors.parentName = "Parent name is required";
        if (!formData.parentPhone.trim())
          newErrors.parentPhone = "Parent phone is required";
        else if (!/^\d{10}$/.test(formData.parentPhone))
          newErrors.parentPhone = "Enter a valid 10-digit phone number";
        if (!formData.parentRelation)
          newErrors.parentRelation = "Relation is required";
      }

      if (step === 3) {
        if (!formData.grade) newErrors.grade = "Grade is required";
        if (!formData.medium) newErrors.medium = "Medium is required";
      }

      if (step === 4) {
        if (formData.batchIds.length === 0)
          newErrors.batchIds = "Select at least one batch" as never;
      }

      if (step === 5) {
        if (!formData.feeAmount || formData.feeAmount <= 0)
          newErrors.feeAmount = "Fee amount must be greater than 0";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const goToNext = useCallback(() => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, totalSteps, validateStep]);

  const goToPrev = useCallback(() => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) setCurrentStep(step);
    },
    [totalSteps]
  );

  const submitForm = async () => {
    if (!validateStep(currentStep)) return false;

    setIsSubmitting(true);
    try {
      // API call to real backend
      await studentService.createStudent(formData);
      return true;
    } catch (error) {
      console.error("Failed to enroll student:", error);
      // Fallback/UI error handling here (e.g. toast)
      alert("Failed to enroll student. Check console for details.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setCurrentStep(1);
  }, []);

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    isSubmitting,
    updateField,
    goToNext,
    goToPrev,
    goToStep,
    submitForm,
    resetForm,
    steps: STUDENT_FORM_STEPS,
  };
}
