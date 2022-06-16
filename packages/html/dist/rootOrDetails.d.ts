/// <reference types="react" />
import { NavigableContent, SubStateCoreInfo, UsesLocation } from '@moxb/moxb';
import { UIFragmentSpec } from './UIFragmentSpec';
/**
 * This is the full spec of the root-or-details component
 */
interface OwnProps<DataType> {
    ifRoot: SubStateCoreInfo<UIFragmentSpec, DataType>;
    ifDetails: SubStateCoreInfo<UIFragmentSpec, DataType>;
}
declare type ComponentProps<DataType> = UsesLocation & NavigableContent<UIFragmentSpec, DataType>;
export interface DetailProps {
    token: string;
}
export declare function rootOrDetails<DataType>(ownProps: OwnProps<DataType>): ((props: ComponentProps<DataType>) => JSX.Element | null) & import("mobx-react").IWrappedComponent<ComponentProps<DataType>>;
export {};
