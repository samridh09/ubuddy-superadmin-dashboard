'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, ChevronDown, LogOut, RefreshCw, AlertCircle, 
  LayoutDashboard, ClipboardList, Users, Briefcase,
  CalendarDays, CreditCard, BarChart2, DollarSign,
  Truck, Shield, Bell, Mail, Settings,
  ClipboardCheck, BookOpen, Clock, TrendingUp,
  Image, School, MessageCircle, Award, List, Building2,
  UserPlus,
  type LucideIcon 
} from 'lucide-react';
import { getAdminDashboard, type DashboardData } from '@/lib/services/dashboard-service';
import { userService } from '@/lib/services/user-service';
import type { DashboardModule, DashboardSubModule } from '@/lib/services/dashboard-service';
import { useAuth } from '@/providers/auth-provider';
import { SCHOOL_ADMIN_MODULES } from '@/lib/constants/modules';

const ICON_MAP: Record<string, LucideIcon> = {
  // Legacy mappings
  'dashboard':            LayoutDashboard,
  'contact-mail':         ClipboardList,
  'people':               Users,
  'person':               Briefcase,
  'schedule':             CalendarDays,
  'card-membership':      CreditCard,
  'assessment':           BarChart2,
  'payment':              DollarSign,
  'directions-bus':       Truck,
  'security':             Shield,
  'admin-panel-settings': Building2,
  'notifications':        Bell,
  'school':               School,
  'mail':                 Mail,
  'event':                CalendarDays,
  'check-circle':         ClipboardCheck,
  'library-books':        BookOpen,
  'assignment':           BookOpen,
  'today':                Clock,
  'trending-up':          TrendingUp,
  'settings':             Settings,
  'image':                Image,
  'award':                Award,
  'message':              MessageCircle,
  
  // New API-driven mappings
  'LayoutDashboard':      LayoutDashboard,
  'ClipboardList':        ClipboardList,
  'UserPlus':             UserPlus,
  'Briefcase':            Briefcase,
  'CalendarDays':         CalendarDays,
  'CreditCard':           CreditCard,
  'Award':                Award,
  'DollarSign':           DollarSign,
  'Truck':                Truck,
  'Shield':               Shield,
  'Building2':            Building2,
  'Bell':                 Bell,
  'Mail':                 Mail,
  'List':                 List,
  'BookOpen':             BookOpen,
  'Clock':                Clock,
  'TrendingUp':           TrendingUp,
  'Settings':             Settings,
  'Image':                Image,
  'ClipboardCheck':       ClipboardCheck,
};

function resolveIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? LayoutDashboard;
}

const SidebarSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="space-y-0.5 pt-2">
    {[72, 88, 64, 80, 76].map((w, i) => (
      <div key={i} className={`mx-2 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} py-2.5 rounded-lg`}>
        <div className="w-4 h-4 rounded bg-gray-200 animate-pulse shrink-0" />
        {!isCollapsed && <div className="ml-4 h-2.5 rounded bg-gray-200 animate-pulse" style={{ width: `${w}%` }} />}
      </div>
    ))}
  </div>
);

export default function SchoolAdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load navigation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!dashboardData?.modules) return;
    const toOpen: string[] = [];
    for (const mod of dashboardData.modules) {
      if (!mod.subModules?.length || mod.hasAccess === false) continue;
      const hasActive = mod.subModules.some((child) => {
        return child.hasAccess !== false && (pathname === child.route || pathname.startsWith(child.route + '/'));
      });
      if (hasActive) toOpen.push(mod.id);
    }
    if (toOpen.length > 0) {
      setOpenDropdowns((prev) => new Set([...prev, ...toOpen]));
    }
  }, [pathname, dashboardData]);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const accessibleModules = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.modules.filter((mod) => mod.hasAccess !== false);
  }, [dashboardData]);

  const renderLeaf = (mod: DashboardSubModule | DashboardModule, indent = false) => {
    // Override route with predefined mapping if exists
    const mappedModule = SCHOOL_ADMIN_MODULES[mod.id];
    const href = mappedModule?.route || mod.route;
    
    const Icon = resolveIcon(mod.icon);
    const isActive = pathname === href || (href !== '/dashboard/schooladmin' && href !== '/wireframe/ui' && pathname.startsWith(href + '/'));
    
    return (
      <div key={mod.id}>
        <button
          onClick={() => { if (href) router.push(href); }}
          title={isCollapsed ? mod.name : undefined}
          className={`w-full group flex items-center ${isCollapsed ? 'justify-center px-0' : indent ? 'px-4' : 'px-6'} py-2.5 rounded-lg transition-all duration-200 border-none cursor-pointer ${
            isActive
              ? 'bg-blue-600/10 text-blue-700 font-bold'
              : 'text-gray-500 hover:bg-blue-50 hover:text-blue-900'
          }`}
        >
          <Icon
            size={indent ? 14 : 18}
            className={`shrink-0 transition-colors duration-200 ${
              isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
            } ${isCollapsed ? '' : indent ? 'mr-3' : 'mr-4'}`}
          />
          {!isCollapsed && (
            indent ? (
              <>
                <ChevronRight
                  size={12}
                  className={`mr-2 transition-transform duration-300 ${isActive ? 'scale-125 translate-x-0.5 text-blue-500' : 'opacity-20 text-gray-200'}`}
                />
                <span className={`text-[11px] font-bold whitespace-nowrap overflow-hidden text-left uppercase tracking-tight ${isActive ? 'text-black' : ''}`}>
                  {mod.name}
                </span>
              </>
            ) : (
              <span className={`text-[12px] font-bold whitespace-nowrap overflow-hidden text-left flex-1 tracking-tight ${isActive ? 'text-blue-700' : ''}`}>
                {mod.name.toUpperCase()}
              </span>
            )
          )}
        </button>
      </div>
    );
  };

  const renderModule = (mod: DashboardModule) => {
    const accessibleSubs = mod.subModules?.filter((s) => s.hasAccess === true) ?? [];

    if (accessibleSubs.length === 0) {
      return renderLeaf(mod);
    }

    const Icon = resolveIcon(mod.icon);
    const isOpen = openDropdowns.has(mod.id);
    
    // Override route with predefined mapping if exists
    const mappedModule = SCHOOL_ADMIN_MODULES[mod.id];
    const href = mappedModule?.route || mod.route;

    const hasActiveChild = accessibleSubs.some((child) => {
      const childMapped = SCHOOL_ADMIN_MODULES[child.id];
      const childHref = childMapped?.route || child.route;
      return child.hasAccess !== false && (pathname === childHref || (childHref !== '/dashboard/schooladmin' && childHref !== '/wireframe/ui' && pathname.startsWith(childHref + '/')));
    });
    const isActive = pathname === href || (href !== '/dashboard/schooladmin' && href !== '/wireframe/ui' && pathname.startsWith(href + '/'));
    const isHighlighted = isActive && !hasActiveChild;

    return (
      <div key={mod.id}>
        <button
          onClick={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
              setOpenDropdowns((p) => new Set([...p, mod.id]));
            } else {
              toggleDropdown(mod.id);
            }
          }}
          title={isCollapsed ? mod.name : undefined}
          className={`w-full group flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} py-2.5 rounded-lg transition-all duration-200 border-none cursor-pointer ${
            isHighlighted ? 'bg-blue-600/10 text-blue-700 font-bold' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-900'
          }`}
        >
          <Icon
            size={18}
            className={`shrink-0 transition-colors duration-200 ${
              isHighlighted ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
            } ${isCollapsed ? '' : 'mr-4'}`}
          />
          {!isCollapsed && (
            <>
              <span className={`text-[12px] font-bold whitespace-nowrap overflow-hidden text-left flex-1 tracking-tight ${isHighlighted ? 'text-blue-700' : ''}`}>
                {mod.name.toUpperCase()}
              </span>
              {isOpen
                ? <ChevronDown size={14} className="text-gray-300" />
                : <ChevronRight size={14} className="text-gray-300" />
              }
            </>
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="mt-1 ml-8 border-l border-gray-100 pl-2 space-y-0.5 animate-in slide-in-from-left-2 duration-300">
            {accessibleSubs.map((child) => renderLeaf(child, true))}
          </div>
        )}
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
        <div className={`h-16 ${isCollapsed ? 'justify-center border-none' : 'px-8 justify-start'} flex items-center shrink-0 border-b border-gray-50`}>
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

        <div className="flex-1 overflow-y-auto pt-4 px-0 space-y-0.5 scrollbar-custom border-none">
          {loading ? (
            <SidebarSkeleton isCollapsed={isCollapsed} />
          ) : error ? (
            <div className="p-4 text-center">
              <AlertCircle className="mx-auto text-red-400 mb-2" size={20} />
              <p className="text-[10px] text-red-500 font-bold uppercase">{error}</p>
              <button onClick={fetchDashboardData} className="mt-2 text-[10px] text-blue-600 font-bold hover:underline uppercase">Retry</button>
            </div>
          ) : (
            <div className="px-2 space-y-0.5">
              {accessibleModules.map((mod) => renderModule(mod))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`w-full flex items-center gap-3 ${isCollapsed ? 'justify-center py-3' : 'px-6 py-3.5'} rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group active:scale-95`}
          >
            <LogOut size={isCollapsed ? 20 : 18} className="group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span className="text-[12px] font-bold uppercase tracking-widest">Sign Out</span>}
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
                onClick={() => { setIsLogoutModalOpen(false); logout(); router.push('/'); }}
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
