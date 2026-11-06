"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full bg-muted-foreground/30 p-0.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-white shadow-sm transition-transform data-checked:translate-x-4" />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
