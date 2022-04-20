import { action, computed, observable, makeObservable } from 'mobx';
import { ViewStore } from './ViewStore';

export class ViewStoreImpl implements ViewStore {
    @observable
    page = 'index';

    constructor() {
        makeObservable(this);
    }

    @action
    openIndexPage() {
        this.page = 'index';
    }

    @action
    openLoginFormPage() {
        this.page = 'loginForm';
    }

    @action
    openMemTablePage() {
        this.page = 'memTable';
    }

    @computed
    get currentUrl() {
        switch (this.page) {
            case 'index':
                return '/';
            case 'loginForm':
                return '/loginForm';
            case 'memTable':
                return '/memTable';
        }
    }
}
