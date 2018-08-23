import { observer } from 'mobx-react';
import { CSSProperties } from 'react';
import * as React from 'react';
import { labelWithHelp, parseProps } from './BindAnt';
import { Input, Form } from 'antd';
import { InputProps } from 'antd/lib/input';
import { Text } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

export interface BindStringAntProps extends React.HTMLProps<HTMLFormElement> {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;
    formStyle?: CSSProperties;
    onPressEnter?(): void;
}

export interface BindSearchStringAntProps extends BindStringAntProps {
    enterButton?: string;
    onSearch?(): void;
}

@observer
export class TextAnt extends React.Component<InputProps & BindStringAntProps> {
    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        const { operation, id, inputType, value, size, prefix, invisible, onPressEnter, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        if ((inputType || operation.inputType) === 'textarea') {
            return (
                <Input.TextArea
                    id={id}
                    placeholder={operation.placeholder}
                    onFocus={operation.onEnterField}
                    onBlur={operation.onExitField}
                    value={operation.value || value || ''}
                    prefix={prefix}
                    onChange={(e: any) => operation.setValue(e.target.value)}
                    onPressEnter={onPressEnter}
                    rows={this.props.rows}
                    {...props as any}
                />
            );
        } else {
            return (
                <Input
                    id={id}
                    placeholder={operation.placeholder}
                    onFocus={operation.onEnterField}
                    onBlur={operation.onExitField}
                    value={operation.value || value || ''}
                    prefix={prefix}
                    onChange={(e: any) => operation.setValue(e.target.value)}
                    onPressEnter={onPressEnter}
                    size={size}
                    {...props as any}
                />
            );
        }
    }
}

@observer
export class TextSearchAnt extends React.Component<InputProps & BindSearchStringAntProps> {
    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        const Search = Input.Search;
        const { operation, id, value, size, prefix, invisible, onSearch, enterButton, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <Search
                id={id}
                placeholder={operation.placeholder}
                onFocus={operation.onEnterField}
                onBlur={operation.onExitField}
                value={operation.value || value || ''}
                prefix={prefix}
                enterButton={enterButton}
                onChange={(e: any) => operation.setValue(e.target.value)}
                onSearch={onSearch}
                size={size}
                {...props as any}
            />
        );
    }
}

@observer
export class TextFormAnt extends React.Component<FormItemProps & BindStringAntProps> {
    render() {
        const { operation, label, invisible, prefix, formStyle, onPressEnter, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <Form.Item
                label={labelWithHelp(label != null ? label : operation.label, operation.help)}
                style={formStyle || undefined}
            >
                <TextAnt operation={operation} prefix={prefix} onPressEnter={onPressEnter} {...props as any} />
            </Form.Item>
        );
    }
}
