import { Confirm as MoxbConfirm } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Confirm, ConfirmProps } from 'semantic-ui-react';

export interface BindConfirmUiProps extends ConfirmProps {
    confirm: MoxbConfirm<any>;
}

export const ConfirmUi = observer(class ConfirmUi extends React.Component<BindConfirmUiProps> {
    render() {
        const { confirm, ...confirmProps } = this.props;
        const { confirmButton, cancelButton, onConfirm, onCancel } = confirm;
        return (
            <Confirm
                {...confirmProps}
                onConfirm={onConfirm}
                onCancel={onCancel}
                open={confirm.open}
                cancelButton={cancelButton.label}
                confirmButton={confirmButton.label}
                content={confirm.content}
                header={confirm.header}
            />
        );
    }
});
