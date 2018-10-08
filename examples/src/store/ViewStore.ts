export interface ViewStore {
    page: string;
    openIndexPage(): void;
    openUiIndexPage(): void;
    openAntIndexPage(): void;
    currentUrl?: string;
}
