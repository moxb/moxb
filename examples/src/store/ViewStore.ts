export type Views = 'index' | 'loginForm' | 'memTable';

export interface ViewStore {
    page: Views;
    openIndexPage(): void;
    openLoginFormPage(): void;
    openMemTablePage(): void;
    currentUrl?: string;
    setUrl(url: string): void;
}
