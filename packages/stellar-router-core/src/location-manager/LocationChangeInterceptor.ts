/**
 * This interface is internal to the navigation system.
 * The interface a components that are interested in messing with location changes.
 */
import { TestLocation } from './TestLocation';

export interface LocationChangeInterceptor {
    /**
     * Each location change interceptor should be able to return a unique ID.
     * This ID is used to recognize newer iterations of the same component.
     */
    getId(): string;

    /**
     * This hook will be called before any "soft" navigation change event can succeed,
     * in order to collect any confirmation questions that must be presented to the user.
     *
     * @param location: Where we want to go
     */
    anyQuestionsFor(location: TestLocation): string[];
}
