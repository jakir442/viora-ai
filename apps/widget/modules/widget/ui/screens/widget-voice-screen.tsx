import { ArrowLeftIcon, MicIcon, MicOffIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import { AIMessage, AIMessageContent } from "@workspace/ui/components/ai/message";
import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useSetAtom } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { cn } from "@workspace/ui/lib/utils";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const { isConnected, isSpeaking, transcript, startCall, endCall, isConnecting } = useVapi();

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button variant="ghost" size="icon" onClick={() => setScreen("selection")}>
            <ArrowLeftIcon />
          </Button>
          <p>Pesan Suara</p>
        </div>
      </WidgetHeader>
      {transcript.length > 0 ? (
        <AIConversation className="h-full flex-1">
          <AIConversationContent>
            {transcript.map((message, index) => (
              <AIMessage from={message.role} key={`${message.role}-${index}-${message.text}`}>
                <AIMessageContent>{message.text}</AIMessageContent>
              </AIMessage>
            ))}
          </AIConversationContent>
        </AIConversation>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
          <div className="flex items-center justify-center rounded-full border bg-white p-3">
            <MicIcon className="size-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Transkrip akan muncul di sini</p>
        </div>
      )}
      <div className="border-t bg-background p-4">
        <div className="flex flex-col items-center gap-y-4">
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-4 rounded-full",
                  isSpeaking ? "animate-pulse bg-red-500" : "bg-green-500"
                )}
              />
              <span className="text-muted-foreground text-sm">
                {isSpeaking ? "Asistant Suara..." : "Mendengarkan..."}
              </span>
            </div>
          )}
          <div className="flex w-full justify-center">
            {isConnected ? (
              <Button className="w-full" size="lg" variant="destructive" onClick={() => endCall()}>
                <MicOffIcon />
                Akhiri Panggilan
              </Button>
            ) : (
              <Button
                className="w-full"
                disabled={isConnecting}
                size="lg"
                onClick={() => startCall()}
              >
                <MicIcon />
                Mulai Panggilan
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
