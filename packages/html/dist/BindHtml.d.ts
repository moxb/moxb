import { Bind } from '@moxb/moxb';
export interface BindHtmlProps<T extends Bind> {
    operation: T;
    invisible?: boolean;
}
/**
 * This function essentially merges the BindAntProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
export declare function parseHtmlProps<T, O>(bindProps: T, _op: O): T & O;
