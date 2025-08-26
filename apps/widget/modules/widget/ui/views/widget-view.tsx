"use client";

import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    // TODO: Confirm wather or not min-h-screen and min-w-screen is needed
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hai! 👋</p>
          <p className="text-lg">Bagaimana kami bisa membantu Anda hari ini?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1">Tampilan widget: {organizationId}</div>
      <WidgetFooter />
    </main>
  );
};
