import { reaction } from 'mobx';
import { Store } from './Store';

// when parcel reloads the page, we have to unsubscribe the old listener...
let oldListener: any;

// this is inspired by https://hackernoon.com/how-to-decouple-state-and-ui-a-k-a-you-dont-need-componentwillmount-cc90b787aa37
// TODO this is way to simple!!!!!!
export class MiniRouter {
    constructor(private readonly store: Pick<Store, 'view'>) {
        reaction(
            () => this.currentUrl,
            () => {
                if (window.location.hash !== this.currentUrl) {
                    window.history.pushState(null, undefined, this.currentUrl);
                }
            }
        );
        if (oldListener) {
            window.removeEventListener('popstate', oldListener);
        }
        oldListener = this.updatePath;
        window.addEventListener('popstate', this.updatePath);
        this.updatePath();
    }
    private updatePath = () => {
        // we use # url and therefore we have to remove the hash when we set the URL
        const path = window.location.hash.replace(/^#\//, '') + '/';
        this.store.view.setUrl(path);
    };
    private get currentUrl() {
        // add the hash because we look at the hash in the url
        return '#' + this.store.view.currentUrl;
    }
}
