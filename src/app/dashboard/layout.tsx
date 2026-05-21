import { SuperAdminGuard } from '@/components/super-admin-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </SuperAdminGuard>
  );
}
