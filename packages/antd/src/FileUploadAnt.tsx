import { Button, Upload } from 'antd';
const path = require('path');
import * as React from 'react';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import { InboxOutlined, LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import type { FileUpload } from '@moxb/moxb';
import { LabelAnt } from './LabelAnt';
import { ActionButtonAnt } from './ActionAnt';
import { BindFormItemAntProps, FormItemAnt } from './FormItemAnt';
import Dragger, { DraggerProps } from 'antd/es/upload/Dragger';

export interface FileUploadProps {
    operation: FileUpload;
}

export const ButtonFileUploadAnt = observer(class ButtonFileUploadAnt extends React.Component<FileUploadProps> {
    componentDidMount() {
        this.props.operation.reset();
    }

    uploadFile(file: File) {
        this.props.operation.upload(file);
    }

    setError(error: string) {
        this.props.operation.setErrorCheckMessage(error);
    }

    constructor(props: FileUploadProps) {
        super(props);
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
            promptTitle,
            visible,
            allowedFileExtensions,
            allowedFileTypes,
            multiple,
        } = this.props.operation;

        if (!visible) {
            return null;
        }

        const props: DraggerProps = {
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
            multiple,
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
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>{promptTitle}</Button>
                    </Upload>
                )}
                <ActionButtonAnt operation={resetAction} />
            </div>
        );
    }
});

export class ButtonFileUploadFormAnt extends React.Component<BindFormItemAntProps & { operation: FileUpload }> {
    render() {
        return (
            <FormItemAnt {...this.props}>
                <ButtonFileUploadAnt operation={this.props.operation} />
            </FormItemAnt>
        );
    }
}

export const DragAndDropFileUploadAnt = observer(class DragAndDropFileUploadAnt extends React.Component<FileUploadProps> {
    componentDidMount() {
        this.props.operation.reset();
    }

    onDrop(files: FileList) {
        if (files.length) {
            if (this.props.operation.multiple) {
                this.props.operation.upload(Array.from(files));
            } else {
                this.props.operation.upload(files[0]);
            }
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
            multiple,
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
            multiple,
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
});

export class DragAndDropFileUploadFormAnt extends React.Component<BindFormItemAntProps & { operation: FileUpload }> {
    render() {
        return (
            <FormItemAnt {...this.props}>
                <DragAndDropFileUploadAnt operation={this.props.operation} />
            </FormItemAnt>
        );
    }
}

export const AreaFileUploadAnt = observer(class AreaFileUploadAnt extends React.Component<FileUploadProps> {
    componentDidMount() {
        this.props.operation.reset();
    }

    onDrop(files: FileList) {
        if (files.length) {
            if (this.props.operation.multiple) {
                this.props.operation.upload(Array.from(files));
            } else {
                this.props.operation.upload(files[0]);
            }
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
            promptTitle,
            visible,
            allowedFileExtensions,
            allowedFileTypes,
            multiple,
        } = this.props.operation;

        if (!visible) {
            return null;
        }

        const draggerProps: DraggerProps = {
            name: 'avatar',
            listType: 'picture-card',
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
            showUploadList: false,
            className: 'avatar-uploader',
            multiple,
        };

        const content = (
            <div>
                {pending ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>{promptTitle}</div>
            </div>
        );

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
                {!(succeeded || pending) && <Upload {...draggerProps}>{content}</Upload>}
                <ActionButtonAnt operation={resetAction} />
            </div>
        );
    }
});

export class AreaFileUploadFormAnt extends React.Component<BindFormItemAntProps & { operation: FileUpload }> {
    render() {
        return (
            <FormItemAnt {...this.props}>
                <AreaFileUploadAnt operation={this.props.operation} />
            </FormItemAnt>
        );
    }
}
