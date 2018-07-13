import { observer } from 'mobx-react';
import * as React from 'react';
import { Confirm, ConfirmProps } from 'semantic-ui-react';
import { Confirm as MoxbConfirm } from './Confirm';

interface BindConfirmUiProps extends ConfirmProps {
    confirm: MoxbConfirm<any>;
}

@observer
export class ConfirmUi extends React.Component<BindConfirmUiProps> {
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
}
