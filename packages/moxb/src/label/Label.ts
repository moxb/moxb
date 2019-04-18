import { Bind } from '..';

export interface Label extends Bind {
    /**
     * The text which should be displayed in the label.
     */
    text?: string;
    /**
     * With this property you can show the raw input string without any escaping or parsing.
     */
    showRawText?: boolean;
}
