import { Text } from '@moxb/moxb';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

export interface BindStringAntProps extends BindAntProps<Text>, InputProps {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;
    onPressEnter?(): void;
    rows?: number;
}

export interface BindSearchStringAntProps extends BindStringAntProps {
    enterButton?: string;
    onSearch?(): void;
}

@observer
export class TextAnt extends React.Component<BindStringAntProps> {
    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        const { operation, id, inputType, value, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        if ((inputType || operation.control) === 'textarea') {
            return (
                <Input.TextArea
                    id={id}
                    placeholder={operation.placeholder}
                    onFocus={operation.onEnterField}
                    onBlur={operation.onExitField}
                    value={operation.value || value || ''}
                    onChange={(e: any) => operation.setValue(e.target.value)}
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
                    onChange={(e: any) => operation.setValue(e.target.value)}
                    {...props as any}
                />
            );
        }
    }
}

/**
 * Use `onSearch` for the search function! Then it will work with the Enter as well as with the search button!
 */
@observer
export class TextSearchAnt extends React.Component<BindSearchStringAntProps> {
    render() {
        const Search = Input.Search;
        const { operation, id, value, invisible, ...props } = parseProps(this.props, this.props.operation);
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
                onChange={(e: any) => operation.setValue(e.target.value)}
                {...props as any}
            />
        );
    }
}

@observer
export class TextFormAnt extends React.Component<BindStringAntProps & BindFormItemAntProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <TextAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
