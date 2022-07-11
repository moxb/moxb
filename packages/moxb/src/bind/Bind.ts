export interface Bind<CustomData = undefined> {
    /**
     * A `.` separated id user for translations
     */
    readonly id: string;
    /**
     * The `id` for DOM Html elements. It is all lowercase and contains `-` as separator.
     */
    readonly domId: string;
    readonly label?: string;
    readonly disabled: boolean; // same as !enabled
    readonly enabled: boolean; // same as !disabled
    readonly reason?: string; // why is this disabled / enabled?
    readonly invisible: boolean;
    readonly readOnly?: boolean; // if false just display the value
    readonly help?: string;
    readonly errors?: string[] | undefined | null;
    readonly errorMessage?: string;
    readonly hasErrors?: boolean;

    setError(error: string | undefined | null): void;
    clearErrors(): void;
    validateField(): void;

    /** @deprecated since version v0.2.0-beta.7 */
    readonly error?: string | undefined | null;
    /** @deprecated since version v0.2.0-beta.7 */
    clearError(): void;

    readonly customData?: CustomData;
}
