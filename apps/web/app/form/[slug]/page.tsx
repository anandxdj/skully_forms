import React from "react";
import PublicFormPageView from "~/components/pages/form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicFormPage({ params }: PageProps) {
  const { slug } = await params;
  return <PublicFormPageView slug={slug} />;
}
