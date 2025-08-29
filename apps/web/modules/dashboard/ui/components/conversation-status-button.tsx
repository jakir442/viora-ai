import { Hint } from "@workspace/ui/components/hint";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

export const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "resolved") {
    return (
      <Hint text="Tandai belum selesai">
        <Button disabled={disabled} onClick={onClick} size="sm" variant="tertiary">
          <CheckIcon />
          Selesai
        </Button>
      </Hint>
    );
  }

  if (status === "escalated") {
    return (
      <Hint text="Tandai selesai">
        <Button disabled={disabled} onClick={onClick} size="sm" variant="warning">
          <ArrowUpIcon />
          Ditingkatkan
        </Button>
      </Hint>
    );
  }

  return (
    <Hint text="Tandai ditingkatkan">
      <Button disabled={disabled} onClick={onClick} size="sm" variant="destructive">
        <ArrowRightIcon />
        Belum selesai
      </Button>
    </Hint>
  );
};
