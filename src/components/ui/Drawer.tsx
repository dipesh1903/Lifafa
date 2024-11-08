import React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "../../utils";
 
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) =>  (
  <DrawerPrimitive.Root shouldScaleBackground={false} {...props}/>
)

const DrawerTripper = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({className , ...props}, ref) => 
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50  bg-light-scrim bg-opacity-60', className)}
    {...props}
  />
)

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({className, children, ...props}, ref) => 
  <DrawerPortal>
      <DrawerPrimitive.Content
        ref={ref}
        className={cn("flex flex-col rounded-t-2xl bg-light-surfaceContainerLow",className)}
        {...props}>
          <div className="mx-auto mt-2 h-2 w-[20%] rounded-full bg-light-onSurfaceVariant" />
          {children}
      </DrawerPrimitive.Content>
  </DrawerPortal>
);

export {
  Drawer,
  DrawerTripper,
  DrawerContent,
  DrawerOverlay
};