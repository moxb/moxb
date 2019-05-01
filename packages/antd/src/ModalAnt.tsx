import { Action, Modal as MoxbModal } from '@moxb/moxb';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface BindModalAntProps<T> extends ModalFuncProps {
    operation: MoxbModal<T>;
    footer?(actions: Action[]): React.ReactNode;
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
export class ModalAnt<T> extends React.Component<BindModalAntProps<T>> {
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
                    {...props as any}
                    visible={operation.open}
                    title={operation.header}
                    onCancel={operation.actions[0].fire}
                    footer={footer(operation.actions)}
                    width={size}
                >
                    {children}
                </Modal>
            );
        }

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
                width={size}
            >
                {children}
            </Modal>
        );
    }
}
