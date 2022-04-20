import { observable, action, computed, makeObservable } from 'mobx';
import type { FileUpload } from './FileUpload';
import { getValueFromStringOrFunction, getValueOrFunction, ValueOrFunction } from '../bind/BindImpl';
import { Label } from '../label/Label';
import { LabelImpl } from '../label/LabelImpl';
import { Action } from '../action/Action';
import { ActionImpl } from '../action/ActionImpl';

interface FileUploadOptions {
    /**
     * All controls must have an ID.
     */
    id: string;

    /**
     * Label to display (in a form)
     */
    label?: ValueOrFunction<string>;

    /**
     * Help message to display (in a form)
     */
    help?: ValueOrFunction<string>;

    /**
     * What prompt should we show to the user?
     */
    prompt?: ValueOrFunction<string>;

    /**
     * What prompt title should we show to the user?
     */
    promptTitle?: ValueOrFunction<string>;

    /**
     * Is multiple file upload allowed?
     */
    readonly multiple?: ValueOrFunction<boolean>;

    /**
     * Should this control be hidden?
     */
    invisible?: ValueOrFunction<boolean>;

    /**
     * Should we call a function upon successful upload?
     */
    onUpload?: (fileName: string, data: ArrayBuffer) => void;

    /**
     * File extensions to allow, if not set everything is allowed
     * Example: ['.mp3', '.png']
     */
    allowedFileExtensions?: ValueOrFunction<string[]>;

    /**
     * File types to allow, if not set everything is allowed
     */
    allowedFileTypes?: ValueOrFunction<string[]>;
}

export class FileUploadImpl implements FileUpload {
    private readonly _reader: FileReader;

    _progress = 0;

    get progress() {
        return this._progress;
    }

    private _setProgress(progress: number) {
        this._progress = progress;
    }

    constructor(private readonly _options: FileUploadOptions) {
        makeObservable<FileUploadImpl, "_setProgress" | "_pending" | "_fileList" | "_fileListLength" | "_currentFileIndex" | "_file" | "_fail" | "_finish">(this, {
            _progress: observable,
            _setProgress: action,
            _pending: observable,
            pending: computed,
            _fileList: observable,
            _fileListLength: observable,
            _currentFileIndex: observable,
            _file: observable,
            _done: observable,
            _data: observable,
            _failed: observable,
            _errorMessage: observable,
            succeeded: computed,
            failed: computed,
            fileName: computed,
            dataAsBinary: computed,
            dataAsString: computed,
            errorMessage: computed,
            reset: action,
            _fail: action,
            _finish: action,
            upload: action,
            setErrorCheckMessage: action
        });

        this._reader = new FileReader();
        this._reader.onabort = () => this._fail('file reading was aborted');
        this._reader.onerror = () => this._fail(this._reader.error?.toString() || 'failed to upload');
        this._reader.onprogress = (event) => {
            this._setProgress(event.loaded / event.total);
        };
        this._reader.onload = () => this._finish(this._reader.result as ArrayBuffer);
    }

    get prompt() {
        return (
            getValueFromStringOrFunction(this._options.prompt) || "Drag 'n' drop a file here, or click to select file"
        );
    }

    get promptTitle() {
        return getValueFromStringOrFunction(this._options.promptTitle) || '';
    }

    get label() {
        return getValueFromStringOrFunction(this._options.label);
    }

    get help() {
        return getValueFromStringOrFunction(this._options.help);
    }

    get invisible() {
        return !!getValueOrFunction(this._options.invisible);
    }

    get visible() {
        return !this.invisible;
    }

    get allowedFileExtensions() {
        return getValueOrFunction(this._options.allowedFileExtensions);
    }

    get allowedFileTypes() {
        return getValueOrFunction(this._options.allowedFileTypes);
    }

    get multiple() {
        return getValueOrFunction(this._options.multiple) || false;
    }

    private _pending = false;

    get pending() {
        return this._pending;
    }

    private _fileList: File[] | undefined;

    private _fileListLength = 0;

    private _currentFileIndex = -1;

    // Current file being uploaded
    private _file: File | undefined;

    _done = false;

    _data: ArrayBuffer | undefined;

    _failed = false;

    _errorMessage: string | undefined;

    readonly errorLabel: Label = new LabelImpl({
        id: 'fileUpload.errorLabel',
        invisible: () => !this._failed,
        text: () => `Failed to upload ${this.fileName || 'file'}: ${this._errorMessage}`,
    });

    readonly successLabel: Label = new LabelImpl({
        id: 'fileUpload.successLabel',
        invisible: () => !this.succeeded,
        text: () => `Uploaded ${this.fileName} (${this._file?.size} bytes)`,
    });

    readonly progressLabel: Label = new LabelImpl({
        id: 'fileUpload.progressLabel',
        invisible: () => !this.pending,
        text: () => `Uploading ${this.fileName}: ${(100 * (this.progress || 0)).toFixed(1)}% ...`,
    });

    get succeeded() {
        return this._done;
    }

    get failed() {
        return this._failed;
    }

    get fileName() {
        return this._file?.name;
    }

    get dataAsBinary() {
        return this.succeeded ? this._data : undefined;
    }

    get dataAsString() {
        return this.succeeded ? Buffer.from(this._data!).toString() : undefined;
    }

    get errorMessage() {
        return this._failed ? this._errorMessage : undefined;
    }

    reset() {
        this._reader.abort();
        this._file = undefined;
        this._done = false;
        this._data = undefined;
        this._pending = false;
        this._errorMessage = undefined;
        this._failed = false;
    }

    readonly resetAction: Action = new ActionImpl({
        id: 'fileUpload.reset',
        invisible: () => !this._done,
        label: 'Reset',
        fire: () => this.reset(),
    });

    protected _fail(errorMessage: string) {
        this._errorMessage = errorMessage;
        this._failed = true;
        this._pending = false;
        this._setProgress(0);
    }

    protected _finish(data: ArrayBuffer) {
        this._data = data;
        this._done = true;
        const { onUpload } = this._options;
        if (onUpload) {
            onUpload(this.fileName!, data);
        }

        if (this._fileList?.length) {
            this._setProgress(this._currentFileIndex / this._fileListLength);
            this.uploadNextFile();
        } else {
            this._pending = false;
            this._setProgress(1);
        }
    }

    upload(file: File | File[]) {
        if (this._pending) {
            if (Array.isArray(file)) {
                this._fileList?.push(...file);
            } else {
                this._fileList?.push(file);
            }
            this._fileListLength = this._fileList!.length;
            this._setProgress(this._currentFileIndex / this._fileListLength);
        } else {
            this.reset();
            this._fileList = Array.isArray(file) ? file : [file];
            this._fileListLength = this._fileList.length;
            this._setProgress(0);
            this._pending = true;
            this.uploadNextFile();
        }
    }

    protected uploadNextFile() {
        if (this._fileList?.length) {
            const file = this._fileList.pop();
            if (file) {
                this._file = file;
                this._currentFileIndex++;
                this._reader.readAsArrayBuffer(file);
            }
        }
    }

    setErrorCheckMessage(error: string) {
        this._failed = true;
        this._errorMessage = error;
    }
}
