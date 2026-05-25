import React from "react";
import ResponsesPageView from "~/components/pages/responses";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResponsesPage({ params }: PageProps) {
  const { id } = await params;
  return <ResponsesPageView formId={id} />;
}
