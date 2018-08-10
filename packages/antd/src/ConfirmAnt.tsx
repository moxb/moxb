import { observer } from 'mobx-react';
import * as React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import { Confirm as MoxbConfirm } from '@moxb/moxb';

export interface BindConfirmAntProps extends ModalFuncProps {
    confirm: MoxbConfirm<any>;
}

@observer
export class ConfirmAnt extends React.Component<BindConfirmAntProps> {
    render() {
        const { confirm, ...confirmProps } = this.props;
        const { confirmButton, cancelButton, onConfirm, onCancel } = confirm;
        return (
            <Modal
                {...confirmProps as any}
                onOk={onConfirm}
                visible={confirm.open}
                onCancel={onCancel}
                cancelText={cancelButton.label}
                okText={confirmButton.label}
                title={confirm.header}
            >
                {confirm.content}
            </Modal>
        );
    }
}
