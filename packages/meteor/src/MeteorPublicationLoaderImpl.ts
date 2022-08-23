import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { getDebugLogger, Logger } from '@moxb/moxb';
import { MeteorPublicationLoader, MeteorPublicationLoaderProps } from './MeteorPublicationLoader';

export class MeteorPublicationLoaderImpl<Input, Document> implements MeteorPublicationLoader<Input, Document> {
    private readonly _logger: Logger;

    constructor(private readonly _props: MeteorPublicationLoaderProps<Input, Document>) {
        const { debug, id, publication, sleeping } = _props;
        const { name } = publication;
        this._logger = getDebugLogger(`Publication loader ${id} for ${name}`, debug);
        if (!sleeping) {
            this.awaken();
        }
        makeObservable(this);
    }

    @observable
    private _input: Input | undefined;

    /**
     * Get the current input
     */
    @computed
    get input(): Input | undefined {
        return this._input;
    }

    @action
    private _setInput(input: Input | undefined) {
        this._input = input;
    }

    @observable
    private _pending = false;

    get pending() {
        return this._pending;
    }

    @action
    private _setPending(value: boolean) {
        this._pending = value;
    }

    @observable
    private _errorMessage?: string;

    get errorMessage(): string | undefined {
        return this._errorMessage;
    }

    @action
    private _setError(error: any) {
        this._errorMessage = error?.toString();
    }

    private _handle?: Meteor.SubscriptionHandle;

    private _subCount = 0;

    @action
    private _resubscribe() {
        this._setInput(this._props.getInput());
        const subCount = this._subCount++;

        if (this._handle) {
            this._logger.log('Stopping previous subscription');
            // TODO: do I have to do this?
            this._handle.stop();
            delete this._handle;
        }

        if (!this.input) {
            this._logger.log('Not subscribing, since input in undefined');
            return;
        }
        this._logger.log(`Subscribing #${subCount} with input`, JSON.stringify(this.input, null, '  '));

        this._setError(undefined);
        this._setPending(true);
        this._handle = this._props.publication.subscribe(this.input, {
            onReady: action(() => {
                this._logger.log(`Data is ready for sub #${subCount}`);
                this._setPending(false);
                const documents = this._props.publication.find(this.input!);
                this._logger.log('Loaded', documents.length, 'documents.');
                this._setDocuments(documents);
            }),
            onStop: action((error) => {
                this._logger.log(`stopping sub #${subCount}: ${error ? error.toString() : 'no error'}`);
                this._setPending(false);
                if (this._props.hideWhileLoading) {
                    this._setDocuments([]);
                }
                this._setError(error);
            }),
        });
    }

    /**
     * Start to listen
     */
    awaken() {
        this._logger.log('Awaking');
        this._resubscribe();
        reaction(
            () => JSON.stringify(this._props.getInput()),
            () => this._resubscribe()
        );
    }

    @observable
    private _documents: Document[] = [];

    @action
    private _setDocuments(documents: Document[]) {
        this._documents = documents;
    }

    /**
     * Get the current documents
     */
    @computed
    get documents(): Document[] {
        if (!this.input) {
            this._logger.log('No input, no output');
            return [];
        } else if (this.pending) {
            if (this._props.hideWhileLoading) {
                this._logger.log('Load pending, returning empty');
                return [];
            } else {
                this._logger.log('Load pending, returning previous data', this._documents.length);
                return this._documents;
            }
        } else {
            this._logger.log('Returning normal data', this._documents.length);
            return this._documents;
        }
    }
}
