import { Modal as MoxbModal, ModalActions } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import { ActionButtonUi } from './ActionUi';

export interface BindModalUiProps<T, A extends ModalActions> extends ModalProps {
    modal: MoxbModal<T, A>;
}

export const ModalUi = observer((props: BindModalUiProps<any, any>) => {
    const { modal, children, ...modalProps } = props;

    function renderActions() {
        const { footer } = props;
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

    const { onOpen, onClose, size, header, open } = modal;
    return (
        <Modal {...modalProps} onOpen={onOpen} onClose={onClose} open={open} size={size}>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>{children}</Modal.Content>
            {renderActions()}
        </Modal>
    );
});
