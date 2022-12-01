/**
 * A Messenger is responsible for displaying messages for the user.
 *
 * An implementation if this could be included in the application store,
 * and the application UI could use an implementation matching the current UI framework.
 * (Bootstrap. Ant Design, etc.)
 */
export interface Messenger {
    info(text: string): void;

    success(text: string): void;

    error(text: string): void;

    warning(text: string): void;

    waiting(text: string): () => void;
}
