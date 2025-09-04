import { Protect } from "@clerk/nextjs";
import { VapiView } from "../../../../modules/plugins/ui/views/vapi-views";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const Page = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <VapiView />
        </PremiumFeatureOverlay>
      }
    >
      <VapiView />
    </Protect>
  );
};

export default Page;
