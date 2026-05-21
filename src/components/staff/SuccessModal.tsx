import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { SuccessModalProps } from "@/types/components/SuccessModal";

export function SuccessModal({ 
  isOpen, 
  message, 
  onClose, 
  title,
  variant = 'success',
  autoCloseDuration = 3000 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  const config = {
    success: {
      icon: <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={2.5} />,
      bgColor: 'bg-green-100',
      barColor: 'bg-green-600',
      defaultTitle: 'Success!',
    },
    error: {
      icon: <XCircle className="w-10 h-10 text-red-600" strokeWidth={2.5} />,
      bgColor: 'bg-red-100',
      barColor: 'bg-red-600',
      defaultTitle: 'Error!',
    },
    warning: {
      icon: <AlertCircle className="w-10 h-10 text-amber-600" strokeWidth={2.5} />,
      bgColor: 'bg-amber-100',
      barColor: 'bg-amber-600',
      defaultTitle: 'Warning!',
    },
    info: {
      icon: <AlertCircle className="w-10 h-10 text-blue-600" strokeWidth={2.5} />,
      bgColor: 'bg-blue-100',
      barColor: 'bg-blue-600',
      defaultTitle: 'Information',
    }
  }[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-400 border border-neutral-100">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Status Icon */}
          <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center animate-in zoom-in duration-500`}>
            {config.icon}
          </div>
          
          {/* Status Message */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {title || config.defaultTitle}
            </h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed px-2">
              {message}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${config.barColor} rounded-full transition-all`}
              style={{
                animation: `shrink ${autoCloseDuration}ms linear forwards`
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
