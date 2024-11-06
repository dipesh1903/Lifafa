import {forwardRef, LabelHTMLAttributes } from "react";


const Label = forwardRef<
HTMLLabelElement,
LabelHTMLAttributes<HTMLLabelElement>
>(({...props}, ref) => 
    <label ref={ref} {...props} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
)

Label.displayName = 'label';
export default Label;
