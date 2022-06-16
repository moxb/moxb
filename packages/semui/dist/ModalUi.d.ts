import { Modal as MoxbModal, ModalActions } from '@moxb/moxb';
import * as React from 'react';
import { ModalProps } from 'semantic-ui-react';
export interface BindModalUiProps<T, A extends ModalActions> extends ModalProps {
    modal: MoxbModal<T, A>;
}
export declare class ModalUi<T, A extends ModalActions = ModalActions> extends React.Component<BindModalUiProps<T, A>> {
    renderActions(): JSX.Element | undefined;
    render(): JSX.Element;
}
