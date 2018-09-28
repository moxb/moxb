import { CSSProperties } from 'react';
import * as React from 'react';
import { Bind } from '@moxb/moxb';
import { Tooltip, Icon } from 'antd';
import { FormItemProps } from 'antd/lib/form';

export interface BindAntProps<T extends Bind> {
    operation: T;
    invisible?: boolean;
}

export interface BindAntFormProps extends FormItemProps {
    // should be part of ant design
    formStyle?: CSSProperties;
}

/**
 * This function essentially merges the BindAntProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
export function parseProps<T, O>(bindProps: T, op: O): T & O {
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

export function labelWithHelp(label: any, help?: string) {
    if (help && typeof label === 'string') {
        return (
            <span>
                {label}{' '}
                <Tooltip title={help}>
                    <Icon type="question-circle-o" />
                </Tooltip>
            </span>
        );
    } else {
        return label;
    }
}

export function getErrorMessages(errors: string[]) {
    return errors.map((err, idx) => (
        <div key={'err_' + idx} className="ant-form-explain">
            {err}
        </div>
    ));
}
