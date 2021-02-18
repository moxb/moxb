import { t, Value as MoxbValue } from '@moxb/moxb';
import { Input, Tag } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

import { TagProps } from 'antd/lib/tag';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface TagAntProps extends TagProps {
    operation: MoxbValue<string[]>;
    newItemLabel?: string;
    tagColor?: string;
}

export interface TagAntState {
    inputVisible: boolean;
    inputValue: string;
}

@observer
export class TagAnt extends React.Component<TagAntProps, TagAntState> {
    private input: any;

    constructor(props: TagAntProps) {
        super(props);
        this.state = {
            inputVisible: false,
            inputValue: '',
        };

        this.showInput = this.showInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputConfirm = this.handleInputConfirm.bind(this);
    }
    componentDidUpdate() {
        if (this.state.inputVisible) {
            this.input.focus();
        }
    }
    showInput() {
        this.setState({ inputVisible: true });
    }
    handleClose(removedTag: string) {
        this.props.operation.setValue(this.props.operation.value!.filter((tag) => tag !== removedTag));
    }
    handleInputChange(e: any) {
        this.setState({ inputValue: e.target.value });
    }
    handleInputConfirm() {
        const inputValue = this.state.inputValue;
        const tags = toJS(this.props.operation.value!);
        if (inputValue && tags.indexOf(inputValue) === -1) {
            this.props.operation.setValue([...tags, inputValue]);
        }
        this.setState({
            inputVisible: false,
            inputValue: '',
        });
    }

    render() {
        const { inputVisible, inputValue } = this.state;

        return (
            <div data-testid={this.props.operation.id} title={this.props.operation.reason}>
                {this.props.operation.value!.map((tag) => (
                    <Tag
                        data-testid={tag}
                        key={tag}
                        closable
                        color={this.props.tagColor}
                        onClose={() => this.handleClose(tag)}
                    >
                        {tag}
                    </Tag>
                ))}
                {inputVisible && (
                    <Input
                        ref={(input: any) => (this.input = input)}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <PlusOutlined />
                        {this.props.newItemLabel || t('TagAnt.newTag', 'New Tag')}
                    </Tag>
                )}
            </div>
        );
    }
}
