"use client";

import { BotIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiAssistants } from "../../hooks/use-vapi-data";

export const VapiAssistantsTab = () => {
  const { data: assistants, isLoading } = useVapiAssistants();

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Assistant</TableHead>
            <TableHead className="px-6 py-4">Model</TableHead>
            <TableHead className="px-6 py-4">Pesan Pertama</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Loading asisten...
                  </TableCell>
                </TableRow>
              );
            }
            if (assistants.length === 0) {
              return (
                <TableRow>
                  <TableCell colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Tidak ada asisten yang dikonfigurasi
                  </TableCell>
                </TableRow>
              );
            }

            return assistants.map((assistant) => (
              <TableRow className="hover:bg-muted/50" key={assistant.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BotIcon className="size-4 text-muted-foreground" />
                    <span> {assistant.name || "Asistant Tanpa nama"}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm">{assistant.model?.model || "Belum dikonfigurasi"}</span>
                </TableCell>
                <TableCell className="max-w-xs px-6 py-4">
                  <p className="truncate text-muted-foreground text-sm">
                    {assistant.firstMessage || "Belum ada pengaturan sapaan"}
                  </p>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
