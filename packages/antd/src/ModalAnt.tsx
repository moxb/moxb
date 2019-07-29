import { Modal as MoxbModal, ModalActions } from '@moxb/moxb';
import { ModalFuncProps } from 'antd/lib/modal';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Modal } from 'antd';

export interface BindModalAntProps<T, A extends ModalActions = ModalActions> extends ModalFuncProps {
    operation: MoxbModal<T, A>;
    footer?(actions: A): React.ReactNode;
}

// same sizes as semantic UI's modals
const SIZES = {
    default: '900px', // default size for ant modal: 512px
    mini: '360px',
    tiny: '540px',
    small: '720px',
    large: '1080px',
    fullscreen: '95% !important',
};

@observer
export class ModalAnt<T, A extends ModalActions = ModalActions> extends React.Component<BindModalAntProps<T, A>> {
    /*
     * Ant Design has no concept for multiple actions in a modal dialog, it will always be an 'okButton' and
     * a 'cancelButton', so we will warn the user, that not more actions are available.
     * */
    render() {
        const { operation, children, footer, width, ...props } = this.props;
        const size = this.props.width || SIZES[operation.size || 'default'];

        if (footer && operation.actions) {
            return (
                <Modal
                    {...(props as any)}
                    visible={operation.open}
                    title={operation.header}
                    onCancel={operation.actions.cancel.fire}
                    footer={footer(operation.actions)}
                    width={size}
                >
                    {children}
                </Modal>
            );
        }

        return (
            <Modal
                {...(props as any)}
                visible={operation.open}
                onCancel={operation.actions.cancel.fire}
                cancelText={operation.actions.cancel.label}
                okText={operation.actions.confirm && operation.actions.confirm.label}
                onOk={operation.actions.confirm && operation.actions.confirm.fire}
                title={operation.header}
                width={size}
            >
                {children}
            </Modal>
        );
    }
}
