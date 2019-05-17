import { Modal as MoxbModal, ModalActions } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import { ActionButtonUi } from './ActionUi';

export interface BindModalUiProps<T, A extends ModalActions> extends ModalProps {
    modal: MoxbModal<T, A>;
}

@observer
export class ModalUi<T, A extends ModalActions = ModalActions> extends React.Component<BindModalUiProps<T, A>> {
    renderActions() {
        const { modal, footer } = this.props;
        const { actions } = modal;

        if (!actions) {
            return undefined;
        }

        if (footer) {
            return <Modal.Actions>{footer(actions)}</Modal.Actions>;
        }

        return (
            <Modal.Actions>
                {actions.cancel && <ActionButtonUi color="blue" size="medium" operation={actions.cancel} />}
                {actions.confirm && <ActionButtonUi color="blue" size="medium" operation={actions.confirm} />}
            </Modal.Actions>
        );
    }

    render() {
        const { modal, children, ...modalProps } = this.props;
        const { onOpen, onClose, size, header, open } = modal;
        return (
            <Modal {...modalProps} onOpen={onOpen} onClose={onClose} open={open} size={size}>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content>{children}</Modal.Content>
                {this.renderActions()}
            </Modal>
        );
    }
}
