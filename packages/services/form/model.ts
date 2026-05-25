import type { DbFormField, DbSubmissionData } from "@repo/database/schema";

export type SubmissionCreatedCallback = (formId: string, submissionId: string) => void;

export interface CreateFormInput {
  userId: string;
  title: string;
  description?: string;
}

export interface UpdateFormInput {
  formId: string;
  userId: string;
  title?: string;
  description?: string;
  published?: boolean;
  layoutMode?: "SCROLL" | "SLIDE";
  theme?: string;
  fields?: DbFormField[];
  submissionMode?: "ANONYMOUS" | "AUTHENTICATED" | "BOTH";
  webhookUrl?: string;
}

export interface SubmitResponseInput {
  slug: string;
  data: DbSubmissionData;
  respondentId?: string;
  deviceFingerprint?: string;
  startedAt?: Date;
  durationMs?: number;
}
