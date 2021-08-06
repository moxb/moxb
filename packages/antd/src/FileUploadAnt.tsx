import * as React from 'react';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import { Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import type { FileUpload } from '@moxb/moxb';
import { LabelAnt } from './LabelAnt';
import { ActionButtonAnt } from './ActionAnt';
import { BindFormItemAntProps, FormItemAnt } from './FormItemAnt';

export interface FileUploadProps {
    operation: FileUpload;
}

@observer
export class FileUploadAnt extends React.Component<FileUploadProps> {
    componentDidMount() {
        this.props.operation.reset();
    }

    onDrop(files: File[]) {
        if (files.length) {
            this.props.operation.upload(files[0]);
        }
    }

    constructor(props: FileUploadProps) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }

    render() {
        const {
            succeeded,
            successLabel,
            errorLabel,
            progressLabel,
            resetAction,
            pending,
            prompt,
            visible,
        } = this.props.operation;

        return (
            visible && (
                <div>
                    <LabelAnt operation={progressLabel} />
                    {pending && <Spin />}
                    <LabelAnt
                        operation={errorLabel}
                        style={{
                            color: 'red',
                            fontWeight: 'bold',
                        }}
                    />
                    <LabelAnt
                        operation={successLabel}
                        style={{
                            color: 'green',
                            fontWeight: 'bold',
                        }}
                    />
                    {!(succeeded || pending) && (
                        <Dropzone onDrop={this.onDrop} maxFiles={1}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {/*Using classes from https://ant.design/components/upload/ */}
                                        <div className="ant-upload ant-upload-drag">
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            {prompt}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    )}
                    <ActionButtonAnt operation={resetAction} />
                </div>
            )
        );
    }
}

export class FileUploadFormAnt extends React.Component<BindFormItemAntProps & { operation: FileUpload }> {
    render() {
        return (
            <FormItemAnt {...this.props}>
                <FileUploadAnt operation={this.props.operation} />
            </FormItemAnt>
        );
    }
}
