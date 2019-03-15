import { Modal as MoxbModal } from '@moxb/moxb';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface BindModalAntProps<T> extends ModalFuncProps {
    operation: MoxbModal<T>;
}

@observer
export class ModalAnt<T> extends React.Component<BindModalAntProps<T>> {
    /*
     * Ant Design has no concept for multiple actions in a modal dialog, it will always be an 'okButton' and
     * a 'cancelButton', so we will warn the user, that not more actions are available.
     * */
    render() {
        const { operation, children, ...props } = this.props;
        if (operation.actions!.length !== 2) {
            console.warn('The modals for ant design UI components must have a fixed number of two actions.');
            return null;
        }
        return (
            <Modal
                {...props as any}
                visible={operation.open}
                onCancel={operation.actions![0].fire}
                onOk={operation.actions![1].fire}
                cancelText={operation.actions![0].label}
                okText={operation.actions![1].label}
                title={operation.header}
            >
                {children}
            </Modal>
        );
    }
}
