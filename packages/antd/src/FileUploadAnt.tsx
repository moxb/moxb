const path = require('path');
import * as React from 'react';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import { Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import type { FileUpload } from '@moxb/moxb';
import { LabelAnt } from './LabelAnt';
import { ActionButtonAnt } from './ActionAnt';
import { BindFormItemAntProps, FormItemAnt } from './FormItemAnt';
import Dragger, { DraggerProps } from 'antd/es/upload/Dragger';

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
            promptTitle,
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
                                            {promptTitle && promptTitle.length && (
                                                <p className="ant-upload-text">{promptTitle}</p>
                                            )}
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

@observer
export class DragAndDropFileUploadAnt extends React.Component<FileUploadProps> {
    componentDidMount() {
        this.props.operation.reset();
    }

    onDrop(files: FileList) {
        if (files.length) {
            this.props.operation.upload(files[0]);
        }
    }

    uploadFile(file: File) {
        this.props.operation.upload(file);
    }

    setError(error: string) {
        this.props.operation.setErrorCheckMessage(error);
    }

    constructor(props: FileUploadProps) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.setError = this.setError.bind(this);
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
            promptTitle,
            visible,
            allowedFileExtensions,
            allowedFileTypes,
        } = this.props.operation;

        if (!visible) {
            return null;
        }

        const draggerProps: DraggerProps = {
            beforeUpload: (file) => {
                if (allowedFileExtensions) {
                    const smallExts = allowedFileExtensions.map((e: string) => e.toLowerCase());
                    if (smallExts.indexOf(path.extname(file.name).toLowerCase()) === -1) {
                        this.setError(`File extension ${path.extname(file.name)} is not allowed`);
                        return false;
                    }
                }

                if (allowedFileTypes) {
                    const smallTypes = allowedFileTypes.map((e: string) => e.toLowerCase());
                    if (smallTypes.indexOf(file.type.toLowerCase()) === -1) {
                        this.setError(`File type ${file.type} is not allowed`);
                        return false;
                    }
                }

                this.uploadFile(file);
                return false;
            },
            onDrop: (e) => this.onDrop(e.dataTransfer.files),
        };

        return (
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
                    <Dragger {...draggerProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        {promptTitle && promptTitle.length && <p className="ant-upload-text">{promptTitle}</p>}
                        <p className="ant-upload-hint">{prompt}</p>
                    </Dragger>
                )}
                <ActionButtonAnt operation={resetAction} />
            </div>
        );
    }
}

export class DragAndDropFileUploadFormAnt extends React.Component<BindFormItemAntProps & { operation: FileUpload }> {
    render() {
        return (
            <FormItemAnt {...this.props}>
                <DragAndDropFileUploadAnt operation={this.props.operation} />
            </FormItemAnt>
        );
    }
}
