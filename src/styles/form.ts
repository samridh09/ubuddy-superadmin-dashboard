/** Shared Tailwind class strings for form inputs — avoids inline duplication across pages */

export const formCls = {
  input:
    'w-full px-4 py-3 border border-gray-100 rounded-xl text-[13px] font-bold bg-gray-50/50 text-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300',
  inputError:
    'border-red-500 focus:ring-red-500/5 focus:border-red-600',
  label:
    'text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block',
  errorText:
    'text-[10px] text-red-500 font-bold ml-1',
  fieldWrapper:
    'space-y-1',
  sectionDivider:
    'h-px bg-gray-50 w-full',
  card:
    'bg-white rounded-[40px] border border-gray-100 p-10 sm:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] animate-in zoom-in-95 duration-500',
  /** Read-only view mode input (no border, transparent) */
  inputView:
    'w-full bg-transparent border-none rounded-xl px-0 py-3 text-[13px] font-bold text-blue-900 focus:outline-none cursor-default',
  /** Edit mode input (bordered, interactive) */
  inputEditMode:
    'w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-blue-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-900/5 transition-all placeholder-gray-300',
} as const;
