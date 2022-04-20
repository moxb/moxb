import { Button, Upload } from 'antd';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Spin } from 'antd';
import { InboxOutlined, LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import type { FileUpload } from '@moxb/moxb';
import { LabelAnt } from './LabelAnt';
import { ActionButtonAnt } from './ActionAnt';
import { BindFormItemAntProps, FormItemAnt } from './FormItemAnt';
import Dragger, { DraggerProps } from 'antd/es/upload/Dragger';
import { useEffect } from 'react';

import * as path from 'path';

export interface FileUploadProps {
    operation: FileUpload;
}

export const ButtonFileUploadAnt = observer((props: FileUploadProps) => {
    const { operation } = props;

    console.log('Calling useEffect in ButtonFileUploadAnt');
    useEffect(() => {
        operation.reset();
    }, []);

    function uploadFile(file: File) {
        operation.upload(file);
    }

    function setError(error: string) {
        operation.setErrorCheckMessage(error);
    }

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
    } = operation;

    if (!visible) {
        return null;
    }

    const dProps: DraggerProps = {
        beforeUpload: (file) => {
            if (allowedFileExtensions) {
                const smallExts = allowedFileExtensions.map((e: string) => e.toLowerCase());
                if (smallExts.indexOf(path.extname(file.name).toLowerCase()) === -1) {
                    setError(`File extension ${path.extname(file.name)} is not allowed`);
                    return false;
                }
            }

            if (allowedFileTypes) {
                const smallTypes = allowedFileTypes.map((e: string) => e.toLowerCase());
                if (smallTypes.indexOf(file.type.toLowerCase()) === -1) {
                    setError(`File type ${file.type} is not allowed`);
                    return false;
                }
            }

            uploadFile(file);
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
                <Upload {...dProps}>
                    <Button icon={<UploadOutlined />}>{promptTitle}</Button>
                </Upload>
            )}
            <ActionButtonAnt operation={resetAction} />
        </div>
    );
});

export const ButtonFileUploadFormAnt = (props: BindFormItemAntProps & { operation: FileUpload }) => (
    <FormItemAnt {...props}>
        <ButtonFileUploadAnt operation={props.operation} />
    </FormItemAnt>
);

export const DragAndDropFileUploadAnt = observer((props: FileUploadProps) => {
    const { operation } = props;

    console.log('Calling useEffect in DragAndDropFileUploadAnt');
    useEffect(() => {
        operation.reset();
    }, []);

    function onDrop(files: FileList) {
        if (files.length) {
            if (operation.multiple) {
                operation.upload(Array.from(files));
            } else {
                operation.upload(files[0]);
            }
        }
    }

    function uploadFile(file: File) {
        operation.upload(file);
    }

    function setError(error: string) {
        operation.setErrorCheckMessage(error);
    }

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
    } = operation;

    if (!visible) {
        return null;
    }

    const draggerProps: DraggerProps = {
        beforeUpload: (file) => {
            if (allowedFileExtensions) {
                const smallExts = allowedFileExtensions.map((e: string) => e.toLowerCase());
                if (smallExts.indexOf(path.extname(file.name).toLowerCase()) === -1) {
                    setError(`File extension ${path.extname(file.name)} is not allowed`);
                    return false;
                }
            }

            if (allowedFileTypes) {
                const smallTypes = allowedFileTypes.map((e: string) => e.toLowerCase());
                if (smallTypes.indexOf(file.type.toLowerCase()) === -1) {
                    setError(`File type ${file.type} is not allowed`);
                    return false;
                }
            }

            uploadFile(file);
            return false;
        },
        onDrop: (e) => onDrop(e.dataTransfer.files),
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
});

export const DragAndDropFileUploadFormAnt = (props: BindFormItemAntProps & { operation: FileUpload }) => (
    <FormItemAnt {...props}>
        <DragAndDropFileUploadAnt operation={props.operation} />
    </FormItemAnt>
);

export const AreaFileUploadAnt = observer((props: FileUploadProps) => {
    const { operation } = props;

    console.log('Calling useEffect in AreaFileUploadAnt');
    useEffect(() => {
        operation.reset();
    }, []);

    function onDrop(files: FileList) {
        if (files.length) {
            if (operation.multiple) {
                operation.upload(Array.from(files));
            } else {
                operation.upload(files[0]);
            }
        }
    }

    function uploadFile(file: File) {
        operation.upload(file);
    }

    function setError(error: string) {
        operation.setErrorCheckMessage(error);
    }

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
    } = operation;

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
                    setError(`File extension ${path.extname(file.name)} is not allowed`);
                    return false;
                }
            }

            if (allowedFileTypes) {
                const smallTypes = allowedFileTypes.map((e: string) => e.toLowerCase());
                if (smallTypes.indexOf(file.type.toLowerCase()) === -1) {
                    setError(`File type ${file.type} is not allowed`);
                    return false;
                }
            }

            uploadFile(file);
            return false;
        },
        onDrop: (e) => onDrop(e.dataTransfer.files),
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
});

export const AreaFileUploadFormAnt = (props: BindFormItemAntProps & { operation: FileUpload }) => (
    <FormItemAnt {...props}>
        <AreaFileUploadAnt operation={props.operation} />
    </FormItemAnt>
);
