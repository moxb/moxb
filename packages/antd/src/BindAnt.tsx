import { Bind } from '@moxb/moxb';
import { Tooltip } from 'antd';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import * as React from 'react';
import { CSSProperties } from 'react';

export interface BindAntProps<T extends Bind> {
    operation: T;
    id?: string;
    invisible?: boolean;
    formStyle?: CSSProperties;
}

/**
 * This function essentially merges the BindAntProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
export function parseProps<T, O>(bindProps: T, _op: O): T & O {
    let { id, operation, invisible, label, help, disabled, reason, readOnly, children, ...props } = bindProps as any;
    id = typeof id !== 'undefined' ? id : operation.domId;
    label = typeof label !== 'undefined' ? label : operation.label;
    help = typeof help !== 'undefined' ? help : operation.help;
    disabled = typeof disabled !== 'undefined' ? disabled : operation.disabled;
    reason = typeof reason !== 'undefined' ? reason : operation.reason;
    readOnly = typeof readOnly !== 'undefined' ? readOnly : operation.readOnly;
    invisible = typeof invisible !== 'undefined' ? invisible : operation.invisible;
    return {
        id,
        operation,
        label,
        help,
        disabled,
        reason,
        readOnly,
        invisible,
        children,
        ...props,
    };
}

/**
 * Create a HTML SPAN that can be used as a label, with an optional popup help, and a ? for indicator.
 */
export function labelWithHelp(label: any, help?: string, id?: string) {
    if (help && typeof label === 'string') {
        return (
            <span data-testid={id + '-help-label'}>
                {label}{' '}
                <Tooltip title={help}>
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        );
    } else {
        return label;
    }
}

/**
 * Creates a HTML SPAN that you can use as a label, with optional ? that help is available.
 *
 * Please not that it doesn't actually provide a popup help; for the use labelWithHelp
 */
export function labelWithHelpIndicator(label: any, help?: string) {
    if (help && typeof label === 'string') {
        return (
            <span>
                {label} <QuestionCircleOutlined />
            </span>
        );
    } else {
        return label;
    }
}

export function getErrorMessages(errors: string[]) {
    return errors.map((err, idx) => (
        <div key={'err_' + idx} data-testid={'err_' + idx} className="ant-form-explain">
            {err}
        </div>
    ));
}
