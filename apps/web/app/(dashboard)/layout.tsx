import { DashboradLayout } from "@/modules/dashboard/ui/layouts/dasbhoard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboradLayout>{children}</DashboradLayout>;
};

export default Layout;
