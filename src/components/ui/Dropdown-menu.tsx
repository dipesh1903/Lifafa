
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { cn } from "../../utils";
import React from "react";

const Dropdown = DropdownMenuPrimitive.Root;

const DropdownTrigger = DropdownMenuPrimitive.Trigger;

const DropdownPortal = DropdownMenuPrimitive.Portal;

const DropdownContent = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
        <DropdownPortal>
            <DropdownPortal>
                <DropdownMenuPrimitive.Content className={cn("z-50 min-w-[8.5rem] overflow-hidden rounded-lg border bg-white p-1.5 py-2 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    className)}
                    ref={ref}
                    {...props}>
                </DropdownMenuPrimitive.Content>
            </DropdownPortal>
        </DropdownPortal>
    )
)

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default [&:not(:last-child)]:mb-[1px] select-none items-center rounded-lg p-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  />
));

export {
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownMenuItem
}