"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
  vapiSecretAtom,
  widgetSettingsAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null }) => {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const setVapiSecrets = useSetAtom(vapiSecretAtom);

  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

  // Step 1: Validate organization
  const validateOrganization = useAction(api.public.organizations.validate);
  useEffect(() => {
    if (step !== "org") {
      return;
    }

    setLoadingMessage("Mencari ID organisasi...");

    if (!organizationId) {
      setErrorMessage("ID Organisasi harus diisi");
      setScreen("error");
      return;
    }

    setLoadingMessage("Memverifikasi organisasi...");

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Konfigurasi tidak valid");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Tidak dapat memverifikasi organisasi");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
    validateOrganization,
    setLoadingMessage,
  ]);

  // Step 2: Validate session (if exists)
  const validateContactSession = useMutation(api.public.contactSessions.validate);
  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Mencari ID sesi kontak...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("settings");
      return;
    }

    setLoadingMessage("Memvalidasi sesi...");

    validateContactSession({ contactSessionId })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("settings");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("settings");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  // Step 3: Load Widget Settings
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId
      ? {
          organizationId,
        }
      : "skip"
  );

  useEffect(() => {
    if (step !== "settings") {
      return;
    }

    setLoadingMessage("Loading Pengaturan Widget...");

    if (widgetSettings !== undefined) {
      setWidgetSettings(widgetSettings);
      setStep("vapi");
    }
  }, [step, widgetSettings, setWidgetSettings, setLoadingMessage]);

  // Step 4: Load Vapi secrets (optional)
  const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets);
  useEffect(() => {
    if (step !== "vapi") {
      return;
    }

    if (!organizationId) {
      setErrorMessage("ID Organisasi harus diisi");
      setScreen("error");
      return;
    }

    setLoadingMessage("Memuat fitur suara...");
    getVapiSecrets({ organizationId })
      .then((secrets) => {
        setVapiSecrets(secrets);
        setStep("done");
      })
      .catch(() => {
        setVapiSecrets(null);
        setStep("done");
      });
  }, [step, organizationId, getVapiSecrets, setVapiSecrets, setLoadingMessage, setStep]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hai! 👋</p>
          <p className="text-lg">Mari kita mulai</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "loading..."}</p>
      </div>
    </>
  );
};
