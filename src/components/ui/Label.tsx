import {forwardRef, LabelHTMLAttributes } from "react";


const Label = forwardRef<
HTMLLabelElement,
LabelHTMLAttributes<HTMLLabelElement>
>(({...props}, ref) => 
    <label ref={ref} {...props} className="block mb-2 text-sm font-medium text-light-onSurfaceVariant"></label>
)

Label.displayName = 'label';
export default Label;
