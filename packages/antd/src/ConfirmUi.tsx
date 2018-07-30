import { observer } from 'mobx-react';
import * as React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import { Confirm as MoxbConfirm } from '@moxb/moxb';

export interface BindConfirmUiProps extends ModalFuncProps {
    confirm: MoxbConfirm<any>;
}

@observer
export class ConfirmUi extends React.Component<BindConfirmUiProps> {
    render() {
        const { confirm, ...confirmProps } = this.props;
        const { confirmButton, cancelButton, onConfirm, onCancel } = confirm;
        return (
            <Modal
                {...confirmProps}
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
