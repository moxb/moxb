import { observable, action, computed } from 'mobx';
import { Views, ViewStore } from './ViewStore';

export class ViewStoreImpl implements ViewStore {
    @observable
    page: Views = 'index';

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
    @action
    setUrl(path: string) {
        switch (path) {
            case '/':
                this.openIndexPage();
                break;
            case '/loginForm':
                this.openLoginFormPage();
                break;
            case '/memTable':
                this.openMemTablePage();
                break;
        }
    }
}
