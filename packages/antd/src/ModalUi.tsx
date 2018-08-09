import { observer } from 'mobx-react';
import * as React from 'react';
import { Modal as MoxbModal } from '@moxb/moxb';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';

export interface BindModalUiProps<T> extends ModalFuncProps {
    modal: MoxbModal<any>;
}

@observer
export class ModalUi<T> extends React.Component<BindModalUiProps<T>> {
    /*
    * Ant Design has no concept for multiple actions in a modal dialog, it will always be an 'okButton' and
    * a 'cancelButton', so we will warn the user, that not more actions are available.
    * */
    render() {
        const { modal, children, ...modalProps } = this.props;
        const { actions, header, open } = modal;
        if (actions!.length !== 2) {
            console.warn('The modals for ant design UI componetns must have a fixed number of two actions.');
            return null;
        }

        return (
            <Modal
                {...modalProps as any}
                visible={open}
                onCancel={actions![0].fire}
                onOk={actions![1].fire}
                cancelText={actions![0].label}
                okText={actions![1].label}
                title={header}
            >
                {children}
            </Modal>
        );
    }
}
