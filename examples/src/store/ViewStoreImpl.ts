import { action, computed, observable, makeObservable } from 'mobx';
import { ViewStore } from './ViewStore';

export class ViewStoreImpl implements ViewStore {
    page = 'index';

    constructor() {
        makeObservable(this, {
            page: observable,
            openIndexPage: action,
            openLoginFormPage: action,
            openMemTablePage: action,
            currentUrl: computed
        });
    }

    openIndexPage() {
        this.page = 'index';
    }

    openLoginFormPage() {
        this.page = 'loginForm';
    }

    openMemTablePage() {
        this.page = 'memTable';
    }

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
