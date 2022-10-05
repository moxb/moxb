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
    children?: React.ReactNode;
}

/**
 * This function essentially merges the BindAntProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
export function parseProps<T, O>(bindProps: T, _op: O): T & O {
    let { id, operation, invisible, label, help, disabled, reason, readOnly, children, ...props } = bindProps as any;
    id = id ?? operation.domId;
    label = label ?? operation.label;
    help = help ?? operation.help;
    disabled = disabled ?? operation.disabled;
    reason = reason ?? operation.reason;
    readOnly = readOnly ?? operation.readOnly;
    invisible = invisible ?? operation.invisible;
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
 * Create a HTML SPAN that can be used as a label, with an optional tooltip, and a ? for indicator.
 */
/** @deprecated since version v0.2.0-beta.70 */
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

/**
 * Create a HTML SPAN that can be used as a label, with an optional title, and a ? for indicator.
 */
export function labelWithHelpSpan(label: any, help?: string, id?: string) {
    if (help && typeof label === 'string') {
        return (
            <span data-testid={id + '-help-label'} title={help}>
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
