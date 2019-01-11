import { Confirm as MoxbConfirm } from '@moxb/moxb';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import { observer } from 'mobx-react';
import * as React from 'react';
import { parseProps } from './BindAnt';
import { BindMarkdownDiv } from './LabelAnt';

export interface BindConfirmAntProps extends ModalFuncProps {
    operation: MoxbConfirm<any>;
    invisible?: boolean;
}

@observer
export class ConfirmAnt extends React.Component<BindConfirmAntProps> {
    render() {
        const { operation, ...props } = parseProps(this.props, this.props.operation);
        return (
            <Modal
                {...props as any}
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
    }
}
