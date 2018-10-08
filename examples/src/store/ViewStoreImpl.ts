import { observable, action, computed } from 'mobx';
import { ViewStore } from './ViewStore';

export class ViewStoreImpl implements ViewStore {
    @observable
    page = 'index';

    @action
    openIndexPage() {
        this.page = 'index';
    }

    @action
    openUiIndexPage() {
        this.page = 'indexUi';
    }

    @action
    openAntIndexPage() {
        this.page = 'indexAnt';
    }

    @computed
    get currentUrl() {
        switch (this.page) {
            case 'index':
                return '/';
            case 'indexUi':
                return '/ui';
            case 'indexAnt':
                return '/ant';
        }
    }
}
