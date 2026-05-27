"use client";

import React from "react";
import { FIELD_TYPES } from "~/lib/field-type-config";
import { FormFieldType } from "@repo/trpc/server/schemas/form-field-schemas";

interface QuestionTypeBadgeProps {
  type: FormFieldType;
  size?: "sm" | "md";
  className?: string;
}

export default function QuestionTypeBadge({ type, size = "sm", className }: QuestionTypeBadgeProps) {
  const cfg = FIELD_TYPES.find((c) => c.type === type);
  if (!cfg) return null;
  const Icon = cfg.icon;
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className={`${sizeClass} rounded-lg border flex items-center justify-center shrink-0 ${cfg.color} ${className ?? ""}`}>
      <Icon className={iconClass} />
    </div>
  );
}
