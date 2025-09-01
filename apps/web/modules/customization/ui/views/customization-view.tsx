"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { CustomizationForm } from "../components/customization-form";

export const CustomizationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

  const isLoading = widgetSettings === undefined || vapiPlugin === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-y-2 bg-muted p-8">
        <Loader2 className="text-muted-foreground animate-spin" />
        <p className="text-muted-foreground text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="max-w-screen-md mx-auto w-full">
        <div className="space-y-2">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Pengaturan Widget</h1>
            <p className="text-muted-foreground">
              Sesuaikan tampilan dan perilaku widget obrolan Anda untuk pelanggan Anda.
            </p>
          </div>

          <div className="mt-8">
            <CustomizationForm initialData={widgetSettings} hasVapiPlugin={!!vapiPlugin} />
          </div>
        </div>
      </div>
    </div>
  );
};
