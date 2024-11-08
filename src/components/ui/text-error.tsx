import {forwardRef, LabelHTMLAttributes } from "react";


const Error = forwardRef<
HTMLSpanElement,
LabelHTMLAttributes<HTMLSpanElement>
>(({...props}, ref) => 
    <span ref={ref} {...props} className="block text-sm text-light-error italic pb-2"></span>
)

Error.displayName = 'label';
export default Error;
