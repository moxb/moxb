import { Action, t, Text } from '@moxb/moxb';
import { Button, Input } from 'antd';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { InputProps, SearchProps } from 'antd/lib/input';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { useEffect, useState } from 'react';

export interface BindStringAntProps extends BindAntProps<Text>, InputProps {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;

    onPressEnter?(): void;

    rows?: number;
}

export interface BindSearchStringAntProps extends SearchProps {
    operation: Text;
    searchAction: Action;
    enterButton?: string;
    clearbuttonstyle?: React.CSSProperties;
    style?: React.CSSProperties;
    btnText?: string;
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

/**
 * Use `onSearch` for the search function! Then it will work with the "Enter" key, as well as with the search button!
 */
export const TextSearchAnt = observer((props: BindSearchStringAntProps) => {
    const [clearBtnOffset, setClearBtnOffset] = useState('85px');

    useEffect(() => {
        updateSearchBtnWidth();
    }, []);

    // TODO: we should also run this on window resize
    function updateSearchBtnWidth() {
        // The search button can change in size, so we adjust the clear btn position
        const elements = document.getElementsByClassName('ant-input-search-button');
        const requiredElement = elements[0] as HTMLElement;
        setClearBtnOffset(requiredElement ? requiredElement.offsetWidth + 10 + 'px' : '85px');
    }

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
    const clearButtonStyle: React.CSSProperties = rest.clearbuttonstyle || {
        position: 'absolute',
        display: 'block',
        right: clearBtnOffset,
        height: '24px',
        width: '24px',
        borderRadius: '20px',
        padding: '0px',
        top: '4px',
        backgroundColor: 'lightgrey',
        zIndex: 1,
    };

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
                onSearch={() => searchAction.fire()}
                onKeyDown={(e) => handleKeyDown(e, operation)}
                {...(rest as any)}
            />
            {operation.value && operation.value.length > 0 && (
                <Button
                    id={id + '-clearBtn'}
                    style={clearButtonStyle}
                    htmlType="button"
                    onClick={() => {
                        operation.setValue('');
                        document.getElementById(id)!.focus();
                        searchAction.fire();
                    }}
                >
                    <CloseOutlined />
                </Button>
            )}
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
