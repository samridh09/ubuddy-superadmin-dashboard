'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import {
  LogOut,
  LayoutDashboard,
  School,
  UserCog,
  Database,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { usePermissions } from '@/hooks/usePermissions';

interface NavItem {
  id: string;
  name: string;
  route: string;
  icon: LucideIcon;
  description?: string;
}

const SidebarSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="space-y-0.5 pt-2">
    {[60, 80, 70].map((w, i) => (
      <div key={i} className={`mx-2 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} py-2.5 rounded-lg`}>
        <div className="w-4 h-4 rounded bg-gray-200 animate-pulse shrink-0" />
        {!isCollapsed && <div className="ml-4 h-2.5 rounded bg-gray-200 animate-pulse" style={{ width: `${w}%` }} />}
      </div>
    ))}
  </div>
);

export default function SuperAdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user: authUser } = useAuth();
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userRole = authUser?.role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isConfigAdmin = userRole === 'CONFIGURATION_ADMIN';

  const isWireframe = pathname.startsWith('/wireframes/ui');
  const base = isWireframe ? '/wireframes/ui' : '/super-admin';

  const navItems: NavItem[] = useMemo(() => [
    { 
      id: 'dashboard',            
      name: 'Dashboard',            
      route: base,                             
      icon: LayoutDashboard,
      description: "Super admin dashboard overview"
    },
    { 
      id: 'school',               
      name: 'School',               
      route: `${base}/school`,                 
      icon: School,
      description: "Manage schools"
    },
    { 
      id: 'configuration-admin',  
      name: 'Configuration Admin',  
      route: `${base}/configuration-admin`,   
      icon: UserCog,
      description: "Configure admin settings"
    },
    { 
      id: 'master',               
      name: 'Master',               
      route: `${base}/master`,                 
      icon: Database,
      description: "Manage subjects & terms"
    },
  ], [base]);

  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => {
      // 1. Dashboard: Always visible
      if (item.id === 'dashboard') return true;

      // 2. SUPER_ADMIN: Has access to everything
      if (isSuperAdmin) return true;

      // 3. CONFIGURATION_ADMIN:
      // - Sees 'Dashboard' (handled above)
      // - Sees 'School' (explicitly allowed)
      // - Does NOT see 'Configuration Admin'
      if (isConfigAdmin) {
        if (item.id === 'school') return true;
        if (item.id === 'configuration-admin') return false;
      }

      // 4. Fallback for other potential roles or permission-based access
      if (item.id === 'school') {
        return hasPermission('schools', 'READ');
      }

      if (item.id === 'configuration-admin') {
        return hasPermission('sub-admin', 'READ');
      }

      if (item.id === 'master') {
        return isSuperAdmin;
      }

      return true;
    });
  }, [navItems, isSuperAdmin, isConfigAdmin, hasPermission]);

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive =
      item.id === 'dashboard'
        ? pathname === item.route
        : pathname === item.route || pathname.startsWith(item.route + '/');

    return (
      <div key={item.id}>
        <button
          onClick={() => router.push(item.route)}
          title={isCollapsed ? item.name : undefined}
          className={`w-full group flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} py-2.5 rounded-lg transition-all duration-200 border-none cursor-pointer ${
            isActive
              ? 'bg-blue-600/10 text-blue-700 font-bold'
              : 'text-gray-500 hover:bg-blue-50 hover:text-blue-900'
          }`}
        >
          <Icon
            size={18}
            className={`shrink-0 transition-colors duration-200 ${
              isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
            } ${isCollapsed ? '' : 'mr-4'}`}
          />
          {!isCollapsed && (
            <span
              className={`text-[12px] font-bold whitespace-nowrap overflow-hidden text-left flex-1 tracking-tight ${
                isActive ? 'text-blue-700' : ''
              }`}
            >
              {item.name.toUpperCase()}
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      <aside
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className={`${isCollapsed ? 'w-16' : 'w-[280px]'} h-screen bg-white flex flex-col shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-[100] overflow-hidden border-r border-gray-100 shadow-sm`}
      >
        {/* Logo */}
        <div
          className={`h-16 ${
            isCollapsed ? 'justify-center border-none' : 'px-8 justify-start'
          } flex items-center shrink-0 border-b border-gray-50`}
        >
          {!isCollapsed ? (
            <h1 className="font-extrabold text-blue-900 text-[15px] tracking-[0.2em] uppercase animate-in fade-in slide-in-from-left-4 duration-700">
              UBUDDY
            </h1>
          ) : (
            <div className="w-9 h-9 bg-blue-600/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20 animate-in fade-in zoom-in duration-500">
              <span className="text-blue-500 font-black text-base">U</span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto pt-4 px-0 scrollbar-custom border-none">
          <div className="px-2 space-y-0.5">
            {(permissionsLoading && !isSuperAdmin) ? (
              <SidebarSkeleton isCollapsed={isCollapsed} />
            ) : (
              filteredNavItems.map((item) => renderNavItem(item))
            )}
          </div>
        </div>

        {/* Sign out */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`w-full flex items-center gap-3 ${
              isCollapsed ? 'justify-center py-3' : 'px-6 py-3.5'
            } rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group active:scale-95`}
          >
            <LogOut
              size={isCollapsed ? 20 : 18}
              className="group-hover:rotate-12 transition-transform"
            />
            {!isCollapsed && (
              <span className="text-[12px] font-bold uppercase tracking-widest">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-10 w-[420px] shadow-2xl border border-neutral-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500 shadow-inner">
              <LogOut size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-blue-900 mb-3 tracking-tight">Confirm Sign Out</h3>
            <p className="text-gray-500 text-[15px] font-bold leading-relaxed mb-8 px-4">
              Are you sure you want to end your session? You will be redirected to the login page.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                  router.push('/');
                }}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-gray-100 active:scale-95 transition-all"
              >
                No, Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-custom::-webkit-scrollbar { width: 12px; height: 12px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.01); }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.25); border-radius: 20px; border: 3px solid transparent; background-clip: content-box; }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.35); }
        aside .scrollbar-custom::-webkit-scrollbar { width: 6px; }
        aside .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); }
        aside .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.25); }
      `}</style>
    </>
  );
}
