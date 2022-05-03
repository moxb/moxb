import { Confirm as MoxbConfirm } from '@moxb/moxb';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { parseProps } from './BindAnt';
import { BindMarkdownDiv } from './LabelAnt';

export interface BindConfirmAntProps extends ModalFuncProps {
    operation: MoxbConfirm<any>;
    invisible?: boolean;
}

export const ConfirmAnt = observer((props: BindConfirmAntProps) => {
    const { operation, ...rest } = parseProps(props, props.operation);
    return (
        <Modal
            {...(rest as any)}
            onOk={operation.onConfirm}
            visible={operation.open}
            onCancel={operation.onCancel}
            cancelText={operation.cancelButton.label}
            okText={operation.confirmButton.label}
            title={<BindMarkdownDiv text={operation.header || ''} />}
        >
            <BindMarkdownDiv text={operation.content} />
        </Modal>
    );
});
