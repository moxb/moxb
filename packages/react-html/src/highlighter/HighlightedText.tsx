import * as React from 'react';
import { HighlightOptions, highlightSearchResult } from './highlighter';

const defaultHighlight: HighlightOptions = {
    style: {
        color: 'red',
        fontWeight: 'bold',
    },
};

/**
 * Display a text, with potential pattern matches highlighted with html SPANs
 */
export const highlightedText = (text: string, pattern: string, options: HighlightOptions = defaultHighlight) => (
    <span
        dangerouslySetInnerHTML={{
            __html: highlightSearchResult(text, pattern, options),
        }}
    />
);

interface HighlightedTextProps {
    /**
     * The text to display
     */
    text: string;

    /**
     * The pattern to search for (and highlight)
     */
    pattern: string;

    /**
     * Optional: what class name to put on the highlighter SPAN?
     */
    options?: HighlightOptions;
}

/**
 * Display a text, with potential pattern matches highlighted with html SPANs
 */
export const HighlightedText = (props: HighlightedTextProps) =>
    highlightedText(props.text, props.pattern, props.options || defaultHighlight);
