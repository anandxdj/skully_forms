"use client";

import React from "react";
import Image from "next/image";
import { trpc } from "~/trpc/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Loader2, AlertCircle, BarChart3, TrendingUp } from "lucide-react";
import { ASSETS } from "~/lib/assets";

interface TabAnalyticsProps {
  formId: string;
}

// Deterministic premium colors matching visual theme palette
const COLORS = [
  "oklch(0.69 0.12 15)",    // Primary Rose
  "oklch(0.60 0.3 25)",     // Cyber Pink
  "oklch(0.78 0.15 150)",   // Forest Mint
  "oklch(0.69 0.2 25)",     // Sunset Amber
  "oklch(0.65 0.01 250)",   // Slate Grey
];

export default function TabAnalytics({ formId }: TabAnalyticsProps) {
  // Query Form analytics (total submissions and option distributions)
  const { data: analytics, isLoading, error } = trpc.submissions.getFormAnalytics.useQuery(
    { formId },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-mono font-bold animate-pulse">Aggregating database submissions...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <p className="text-xs font-bold text-foreground">Analytics aggregated unsuccessfully</p>
        <p className="text-4xs text-muted-foreground/80 max-w-xs leading-relaxed">
          {error?.message || "There was an issue compiling question option ratios."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Aggregated Totals Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-border bg-card/45 flex items-center justify-between">
          <div>
            <p className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
              Total Responses
            </p>
            <p className="font-heading text-3xl font-extrabold text-foreground mt-2 leading-none">
              {analytics.totalSubmissions}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/45 flex items-center justify-between">
          <div>
            <p className="text-4xs font-black uppercase text-muted-foreground tracking-widest">
              Completion Rate
            </p>
            <p className="font-heading text-3xl font-extrabold text-success mt-2 leading-none">
              {analytics.totalSubmissions > 0 ? "100%" : "0%"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-success-bg border border-success/20 text-success">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Option Distributions Visual grid */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">
          Question Choices Distribution
        </h3>

        {analytics.distributions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl select-none space-y-3">
            <div className="relative w-24 h-24">
              <Image src={ASSETS.skeletons.inBox} alt="No chart data" fill className="object-contain drop-shadow" />
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-[240px]">
              No option-based questions found. Add Select, Radio, or Checkbox fields to see distributions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics.distributions.map((dist) => {
              const totalDist = dist.distribution.reduce((acc, curr) => acc + curr.count, 0);

              return (
                <div
                  key={dist.fieldId}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-5xs font-black uppercase tracking-wider">
                      {dist.fieldType}
                    </span>
                    <h4 className="text-xs font-black text-foreground leading-snug line-clamp-2">
                      {dist.fieldLabel}
                    </h4>
                    <p className="text-5xs text-muted-foreground">
                      Responses ratio: {totalDist} choices selected
                    </p>
                  </div>

                  {/* Horizontal Bar Chart representation */}
                  <div className="h-44 w-full select-none font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dist.distribution}
                        layout="vertical"
                        margin={{ top: 5, right: 15, left: -25, bottom: 5 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="option"
                          type="category"
                          tick={{ fill: "oklch(0.55 0.005 70)", fontSize: 9, fontWeight: 700 }}
                          width={80}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                          contentStyle={{
                            backgroundColor: "oklch(0.12 0 0)",
                            borderColor: "oklch(1 0 0 / 10%)",
                            borderRadius: "10px",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                          {dist.distribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
