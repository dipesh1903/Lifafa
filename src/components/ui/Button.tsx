import { Button, ButtonProps } from "@radix-ui/themes"
import { ElementRef, forwardRef } from "react"
import { cn } from "../../utils"


const PrimaryButton = forwardRef<ElementRef<typeof Button>, ButtonProps>(({className, ...props}, ref) => (
    <Button 
        ref={ref}
        {...props}
        className={cn(className, "justify-self-center group-invalid:pointer-events-none group-invalid:opacity-30 group-invalid:cursor-none focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center  bg-light-primary text-light-onPrimary")}>
        {props.children}
    </Button>
))

export { PrimaryButton };
