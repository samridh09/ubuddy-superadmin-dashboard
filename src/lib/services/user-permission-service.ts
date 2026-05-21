import { API_ENDPOINTS, getAuthHeader } from '../api';

type AccessNode = {
  access: boolean;
  permissions?: string[];
  modules?: Record<string, AccessNode>;
};

// Raw shape returned by /v1/user/modules/access
export interface RawModuleAccessResponse {
  school?: {
    access: boolean;
    academics?:      AccessNode;
    students?:       AccessNode;
    staff?:          AccessNode;
    communication?:  AccessNode;
    fee?:            AccessNode;
    transportation?: AccessNode;
    classes?:        AccessNode;
    sessions?:       AccessNode;
    schools?:        AccessNode;
    'sub-admin'?:    AccessNode;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Normalized flat shape used by the Sidebar
export interface ModuleAccessResponse {
  [moduleName: string]: {
    access: boolean;
    permissions?: string[];
    modules?: Record<string, { access: boolean; permissions?: string[] }>;
    [key: string]: unknown;
  };
}

export const getCurrentUserModuleAccess = async (type?: 'SCHOOL_ADMIN' | 'SCHOOL_SUB_ADMIN' | 'SCHOOL_STAFF'): Promise<ModuleAccessResponse> => {
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  const response = await fetch(`${API_ENDPOINTS.dashboard.adminModules}${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeader() as Record<string, string>),
    },
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch module access');
  }

  const result: ModuleAccessResponse = {};
  
  const groups = responseData.data?.groups || {};
  
  for (const [groupName, groupModules] of Object.entries(groups)) {
    const groupNode: any = {
      access: true,
      modules: {}
    };
    
    for (const mod of (groupModules as any[])) {
      groupNode.modules[mod.id] = {
        access: mod.hasAccess,
        permissions: mod.permissions
      };
      
      if (mod.subModules) {
        for (const sub of mod.subModules) {
          groupNode.modules[sub.id] = {
            access: sub.hasAccess,
            permissions: sub.permissions
          };
        }
      }
    }
    
    result[groupName] = groupNode;
  }
  
  const allModules = responseData.data?.modules || [];
  for (const mod of allModules) {
    result[mod.id] = {
      access: mod.hasAccess,
      permissions: mod.permissions
    };
    if (mod.subModules) {
      for (const sub of mod.subModules) {
        result[sub.id] = {
          access: sub.hasAccess,
          permissions: sub.permissions
        };
      }
    }
  }

  return result;
};
