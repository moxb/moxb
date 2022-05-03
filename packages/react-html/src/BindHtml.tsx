import { Bind } from '@moxb/moxb';

export interface BindHtmlProps<T extends Bind> {
    operation: T;
    invisible?: boolean;
}

/**
 * This function essentially merges the BindAntProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
export function parseHtmlProps<T, O>(bindProps: T, _op: O): T & O {
    let { id, operation, invisible, label, disabled, readOnly, children, ...props } = bindProps as any;
    id = typeof id !== 'undefined' ? id : operation.domId;
    label = typeof label !== 'undefined' ? label : operation.label;
    disabled = typeof disabled !== 'undefined' ? disabled : operation.disabled;
    readOnly = typeof readOnly !== 'undefined' ? readOnly : operation.readOnly;
    invisible = typeof invisible !== 'undefined' ? invisible : operation.invisible;
    return {
        id,
        operation,
        label,
        disabled,
        readOnly,
        invisible,
        children,
        ...props,
    };
}
