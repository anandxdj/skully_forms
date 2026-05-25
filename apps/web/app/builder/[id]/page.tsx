import React from "react";
import BuilderPageView from "~/components/pages/builder";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BuilderPage({ params }: PageProps) {
  const { id } = await params;
  return <BuilderPageView formId={id} />;
}
