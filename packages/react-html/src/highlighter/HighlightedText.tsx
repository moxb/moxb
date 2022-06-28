import * as React from 'react';
import { highlightSearchResult } from './highlighter';

import './highlighter.css';
const DEFAULT_CLASS = 'highlighter-text-match';

export const highlightedText = (text: string, pattern: string, className = DEFAULT_CLASS) => (
    <span
        dangerouslySetInnerHTML={{
            __html: highlightSearchResult(text, pattern, className),
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
    className?: string;
}

/**
 * Display a text, with potential pattern matches highlighted
 */
export const HighlightedText = (props: HighlightedTextProps) =>
    highlightedText(props.text, props.pattern, props.className || DEFAULT_CLASS);
