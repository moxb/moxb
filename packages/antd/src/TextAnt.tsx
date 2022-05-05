import { Action, t, Text } from '@moxb/moxb';
import { Input } from 'antd';
import { InputProps, SearchProps } from 'antd/lib/input';
import { observer } from 'mobx-react-lite';
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

export const TextAnt = observer((props: BindStringAntProps) => {
    const { operation, id, inputType, value, invisible, reason, ...rest } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }
    if ((inputType || operation.control) === 'textarea') {
        return (
            <Input.TextArea
                title={reason}
                id={id}
                data-testid={id}
                placeholder={operation.placeholder}
                onFocus={operation.onEnterField}
                onBlur={operation.onExitField}
                value={operation.value || value || ''}
                onChange={(e: any) => operation.setValue(e.target.value)}
                {...(rest as any)}
            />
        );
    } else {
        return (
            <Input
                title={reason}
                id={id}
                data-testid={id}
                placeholder={operation.placeholder}
                onFocus={operation.onEnterField}
                onBlur={operation.onExitField}
                value={operation.value || value || ''}
                onChange={(e: any) => operation.setValue(e.target.value)}
                {...(rest as any)}
            />
        );
    }
});

export interface BindSearchStringAntProps extends SearchProps {
    operation: Text;
    searchAction: Action;
    enterButton?: string;
    clearbuttonstyle?: React.CSSProperties;
    style?: React.CSSProperties;
    btnText?: string;
}
/**
 * Use `onSearch` for the search function! Then it will work with the "Enter" key, as well as with the search button!
 */
export const TextSearchAnt = observer((props: BindSearchStringAntProps) => {
    function handleKeyDown(e: React.KeyboardEvent<HTMLElement>, inputValue?: Text) {
        if (e.keyCode === 27 && inputValue) {
            inputValue.setValue('');
        }
    }

    const Search = Input.Search;
    const { operation, id, value, invisible, style, enterButton, searchAction, ...rest } = parseProps(
        props,
        props.operation
    );
    if (invisible) {
        return null;
    }
    return (
        <div
            style={{
                ...style,
                ...{ position: 'relative', marginBottom: '1.5em' },
            }}
        >
            <Search
                id={id}
                placeholder={operation.placeholder}
                onFocus={operation.onEnterField}
                onBlur={operation.onExitField}
                value={operation.value || value || ''}
                style={{ marginBottom: '0' }}
                onChange={(e: any) => operation.setValue(e.target.value)}
                enterButton={enterButton || t('TableSearchAnt.btnTitle', 'Search')}
                onSearch={(query) => {
                    operation.setValue(query);
                    searchAction.fire();
                }}
                onKeyDown={(e) => handleKeyDown(e, operation)}
                allowClear
                {...(rest as any)}
            />
        </div>
    );
});

export const TextFormAnt = observer((props: BindStringAntProps & BindFormItemAntProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <TextAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
