import React from "react";
import {
  Palette,
  Monitor,
  Smartphone,
  Play,
  Settings,
} from "lucide-react";
import { cn } from "~/lib/utils";

export type DeviceMode = "desktop" | "mobile";

interface TopBarSecondaryProps {
  onDesignClick: () => void;
  onSettingsClick: () => void;
  onPreviewOpen: () => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (m: DeviceMode) => void;
}

export default function TopBarSecondary({
  onDesignClick,
  onSettingsClick,
  onPreviewOpen,
  deviceMode,
  onDeviceModeChange,
}: TopBarSecondaryProps) {
  return (
    <div className="shrink-0 h-12 px-4 border-b border-border/30 bg-card/40 backdrop-blur-sm flex items-center justify-between gap-3 z-20">
      {/* Left: Spacer */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
      </div>

      {/* Center cluster: Design / Device toggle / Play */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onDesignClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-border/50 bg-background hover:border-border hover:bg-muted/40 text-foreground transition-all cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Design</span>
        </button>

        <div className="flex items-center bg-background border border-border/50 rounded-xl p-0.5 ml-1">
          <button
            onClick={() => onDeviceModeChange("desktop")}
            className={cn(
              "p-1.5 rounded-lg transition-all cursor-pointer",
              deviceMode === "desktop"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Desktop preview"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeviceModeChange("mobile")}
            className={cn(
              "p-1.5 rounded-lg transition-all cursor-pointer",
              deviceMode === "mobile"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Mobile preview"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onPreviewOpen}
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-border/50 bg-background hover:bg-muted/40 text-foreground transition-all cursor-pointer ml-1"
          title="Play preview"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Right: settings */}
      <div className="flex items-center gap-1 flex-1 justify-end">
        <button
          onClick={onSettingsClick}
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
