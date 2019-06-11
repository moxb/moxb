import { forwardRef } from 'react';

// forward references
const empty: any = (_props: any, _ref: any) => {};
export const ReactForwardRefSymbol = typeof forwardRef === 'function' && forwardRef(empty).$$typeof;

// this should return component is ForwardRef, but React has no ForwardRef type...
export function isForwardRef(component: any): boolean {
    if (!component || typeof component !== 'object') {
        return false;
    }

    return component.$$typeof === ReactForwardRefSymbol;
}
