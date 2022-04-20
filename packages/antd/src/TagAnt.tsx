import { t, Value as MoxbValue } from '@moxb/moxb';
import { Input, Tag } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

import { TagProps } from 'antd/lib/tag';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useEffect, useState } from 'react';

export interface TagAntProps extends TagProps {
    operation: MoxbValue<string[]>;
    newItemLabel?: string;
    tagColor?: string;
}

export const TagAnt = observer((props: TagAntProps) => {
    const [inputValue, setInputValue] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const { operation, tagColor, newItemLabel } = props;

    let inputRef: any;

    useEffect(() => {
        if (inputVisible) {
            inputRef.focus();
        }
    });

    function showInput() {
        setInputVisible(true);
    }

    function handleClose(removedTag: string) {
        operation.setValue(operation.value!.filter((tag) => tag !== removedTag));
    }

    function handleInputChange(e: any) {
        setInputValue(e.target.value);
    }

    function handleInputConfirm() {
        const tags = toJS(operation.value!);
        if (inputValue && tags.indexOf(inputValue) === -1) {
            operation.setValue([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    }

    return (
        <div data-testid={operation.id} title={operation.reason}>
            {operation.value!.map((tag) => (
                <Tag data-testid={tag} key={tag} closable color={tagColor} onClose={() => handleClose(tag)}>
                    {tag}
                </Tag>
            ))}
            {inputVisible && (
                <Input
                    ref={(input: any) => (inputRef = input)}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                    <PlusOutlined />
                    {newItemLabel || t('TagAnt.newTag', 'New Tag')}
                </Tag>
            )}
        </div>
    );
});
