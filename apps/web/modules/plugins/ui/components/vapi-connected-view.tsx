"use client";

import { BotIcon, PhoneIcon, SettingsIcon, UnplugIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { VapiPhoneNumbersTab } from "./vapi-phone-numbers-tab";
import { VapiAssistantsTab } from "./vapi-assistants-tab";

interface VapiConnectedViewProps {
  onDisconnect: () => void;
}

export const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
  const [activeTab, setActiveTab] = useState("phone-numbers");

  return (
    <div className="space-y-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              alt="Vapi"
              className="rounded-lg object-contain"
              height={48}
              width={48}
              src="/vapi.jpg"
            />
            <div>
              <CardTitle>Integrasi Vapi</CardTitle>
              <CardDescription>Kelola nomor telepon dan asisten AI Anda</CardDescription>
            </div>
          </div>

          <Button onClick={onDisconnect} size="sm" variant="destructive">
            <UnplugIcon />
            Putuskan sambungan
          </Button>
        </div>
      </CardHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg border bg-muted ">
                <SettingsIcon className="size-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>Pengaturan Widget</CardTitle>
                <CardDescription>Atur panggilan suara untuk widget chat Anda</CardDescription>
              </div>
            </div>
            <Button asChild>
              <Link href="/customization">
                <SettingsIcon />
                Pengaturan
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="overflow-hidden rounded-lg border bg-background">
        <Tabs
          className="gap-6"
          defaultValue="phone-numbers"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="grid h-12 w-full grid-cols-2 p-0">
            <TabsTrigger className="h-full rounded-none" value="phone-numbers">
              <PhoneIcon />
              Nomor Telepon
            </TabsTrigger>
            <TabsTrigger className="h-full rounded-none" value="assistants">
              <BotIcon />
              Asisten AI
            </TabsTrigger>
          </TabsList>
          <TabsContent value="phone-numbers">
            <VapiPhoneNumbersTab />
          </TabsContent>
          <TabsContent value="assistants">
            <VapiAssistantsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
