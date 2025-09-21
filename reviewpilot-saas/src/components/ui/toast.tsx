import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, type = "info", onClose, ...props }, ref) => {
    const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: AlertCircle,
    }

    const colors = {
      success: "border-green-500 bg-green-500/10 text-green-400",
      error: "border-red-500 bg-red-500/10 text-red-400",
      warning: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
      info: "border-cyan-500 bg-cyan-500/10 text-cyan-400",
    }

    const Icon = icons[type]

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-4 right-4 z-50 flex w-full max-w-sm items-center space-x-4 rounded-xl border p-4 shadow-lg backdrop-blur-sm",
          colors[type]
        )}
        {...props}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          {title && <p className="font-semibold">{title}</p>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }
