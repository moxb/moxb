import { ModalFuncProps } from 'antd/lib/modal';
import { observer } from 'mobx-react';
import { parseProps } from './BindAnt';
import { Modal, Button } from 'antd';
import { BindMarkdownDiv } from './LabelAnt';
import * as React from 'react';
import { Bind, SelectableConfirm } from '@moxb/moxb';

export interface BindSelectableConfirmAntProps extends ModalFuncProps {
    operation: SelectableConfirm<any>;
    invisible?: boolean;
}

@observer
export class SelectableConfirmAnt extends React.Component<BindSelectableConfirmAntProps> {
    render() {
        const { operation, ...props } = parseProps(this.props, this.props.operation);

        if (!operation.confirmButtons.length) {
            console.warn('SelectableConfirmAnt was called without any confirm button!');
            return null;
        }

        return (
            <Modal
                {...(props as any)}
                onOk={() => operation.onConfirm(0)}
                visible={operation.open}
                onCancel={operation.onCancel}
                cancelText={operation.cancelButton.label}
                okText={operation.confirmButtons[0].label}
                title={<BindMarkdownDiv text={operation.header || ''} />}
                footer={[
                    ...operation.confirmButtons.map((b: Bind, i: number) => (
                        <Button key={b.id} type="primary" onClick={() => operation.onConfirm(i)}>
                            {b.label}
                        </Button>
                    )),
                    <Button key="back" onClick={operation.onCancel}>
                        {operation.cancelButton.label}
                    </Button>,
                ]}
            >
                <BindMarkdownDiv text={operation.content} />
            </Modal>
        );
    }
}
