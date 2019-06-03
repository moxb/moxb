import { Action, t, Text } from '@moxb/moxb';
import { Button, Icon, Input } from 'antd';
import { InputProps, SearchProps } from 'antd/lib/input';
import { observer } from 'mobx-react';
import * as React from 'react';
import { CSSProperties } from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

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
    clearbuttonstyle?: {};
    style?: {};
    btnText?: string;
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
    private clearBtnOffset: string;

    constructor(props: BindSearchStringAntProps) {
        super(props);
        this.clearBtnOffset = '85px';
    }

    componentDidMount(): void {
        this.getSearchBtnWidth();
    }

    getSearchBtnWidth() {
        // The search button can change in size, so we adjust the clear btn position
        const elements = document.getElementsByClassName('ant-input-search-button');
        const requiredElement = elements[0] as HTMLElement;
        this.clearBtnOffset = requiredElement ? requiredElement.offsetWidth + 10 + 'px' : '85px';
    }

    handleKeyDown(e: React.KeyboardEvent<HTMLElement>, inputValue?: Text) {
        if (e.keyCode === 27 && inputValue) {
            inputValue.setValue('');
        }
    }

    render() {
        const Search = Input.Search;
        const { operation, id, value, invisible, style, enterButton, searchAction, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        const clearButtonStyle: CSSProperties = this.props.clearbuttonstyle || {
            position: 'absolute',
            display: 'block',
            right: this.clearBtnOffset,
            height: '24px',
            width: '24px',
            borderRadius: '20px',
            padding: '0px',
            top: '4px',
            backgroundColor: 'lightgrey',
            zIndex: 1,
        };

        return (
            <div style={{ ...style, ...{ position: 'relative', marginBottom: '1.5em' } }}>
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
                    onKeyDown={e => this.handleKeyDown(e, operation)}
                    {...props as any}
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
                        <Icon type="close" />
                    </Button>
                )}
            </div>
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
