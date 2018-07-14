import { observer } from 'mobx-react';
import * as React from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import { ActionButtonUi } from './ActionUi';
import { Modal as MoxbModal } from '@moxb/moxb';

export interface BindModalUiProps<T> extends ModalProps {
    modal: MoxbModal<T>;
}

@observer
export class ModalUi<T> extends React.Component<BindModalUiProps<T>> {
    render() {
        const { modal, children, ...modalProps } = this.props;
        const { actions, onOpen, onClose, size, header, open } = modal;
        return (
            <Modal {...modalProps} onOpen={onOpen} onClose={onClose} open={open} size={size}>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content>{children}</Modal.Content>
                {actions && (
                    <Modal.Actions>
                        {actions.map((action, idx) => (
                            <ActionButtonUi key={idx} color="blue" size="medium" operation={action} />
                        ))}
                    </Modal.Actions>
                )}
            </Modal>
        );
    }
}
