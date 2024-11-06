import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "../../utils"
import { forwardRef } from "react"

type props = {
    radioItems: Array<{
        label: string,
        value: string
    }>,
    onValueChange: (val: string) => void,
    defaultValue: string,
    className?: string
}

const AccessRadioGroup = forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    props
>(({radioItems, onValueChange, defaultValue, className}, ref) => {
    return (
        <form>
            <RadioGroupPrimitive.Root className={cn("flex gap-1.5", className)}
			defaultValue={defaultValue}
			aria-label="View density"
            onValueChange={onValueChange}
            ref={ref}
            >
                {
                    radioItems.map((item) => {
                        return (
                            <div className="flex items-center">
                                <RadioGroupPrimitive.Item key={item.label} value={item.value} className="group cursor-default rounded-full bg-white outline-none hover:bg-violet-500/30 border-2">
                                    <div className="relative py-1 px-4 group-data-[state=checked]:text-black text-blue-300"><span>{item.label}</span>
                                    <RadioGroupPrimitive.Indicator className="absolute top-0 left-0 flex size-full items-center justify-center after:block after:size-full after:rounded-full after:bg-violet-500/30" />
                                    </div>
                                </RadioGroupPrimitive.Item>
                            </div>
                        )
                    })
                }
            </RadioGroupPrimitive.Root>
        </form>
    );
});

export default AccessRadioGroup;