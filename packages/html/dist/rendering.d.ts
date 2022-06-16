/// <reference types="react" />
import { Navigable, SubStateCoreInfo, NavControl } from '@moxb/moxb';
import { UIFragmentSpec } from './UIFragmentSpec';
export declare function renderFallback(props: Navigable<UIFragmentSpec, any>): JSX.Element | null;
interface RenderProps<DataType> {
    state: SubStateCoreInfo<UIFragmentSpec, DataType> | null;
    navigationContext: Navigable<UIFragmentSpec, DataType>;
    tokenIncrease?: number;
    extraProps?: any;
    checkCondition?: boolean;
    navControl: NavControl;
}
export declare function renderSubStateCore<DataType>(props: RenderProps<DataType>): JSX.Element | null;
export {};
