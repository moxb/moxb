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

    /**
     * Get the current input
     */
    @computed
    get input(): Input | undefined {
        return this._props.getInput();
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

    private _resubscribe(input: Input | undefined) {
        if (this._handle) {
            this._logger.log('Stopping previous subscription');
            // TODO: do I have to do this?
            this._handle.stop();
            delete this._handle;
        }

        if (!input) {
            this._logger.log('Not subscribing, since input in undefined');
            return;
        }
        this._logger.log('Subscribing with input', JSON.stringify(input, null, '  '));

        this._setError(undefined);
        this._setPending(true);
        this._handle = this._props.publication.subscribe(input, {
            onReady: () => {
                this._logger.log('Data is ready');
                this._setPending(false);
            },
            onStop: (error) => {
                this._logger.log('stopping:', error.toString());
                this._setPending(false);
                this._setError(error);
            },
        });
    }

    /**
     * Start to listen
     */
    awaken() {
        this._logger.log('Awaking');
        this._resubscribe(this.input);
        reaction(
            () => this.input,
            (input) => this._resubscribe(input)
        );
    }

    /**
     * Get the current documents
     */
    get documents(): Document[] {
        return this.input ? (this.pending ? [] : this._props.publication.find(this.input)) : [];
    }
}
