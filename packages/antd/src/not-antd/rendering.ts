import { Navigable, SubStateCoreInfo } from '@moxb/moxb';
import { renderUIFragment } from './UIFragment';
import { extractUIFragmentFromSpec, UIFragmentSpec } from './UIFragmentSpec';

export function renderFallback(props: Navigable<UIFragmentSpec, any>) {
    const { filterCondition, fallback, part, parsedTokens } = props;
    const navigableChildParams: Navigable<UIFragmentSpec, any> = {
        parsedTokens,
        filterCondition,
        fallback,
        part,
    };
    const fallbackFragment = extractUIFragmentFromSpec({}, fallback, part);
    return renderUIFragment(fallbackFragment, navigableChildParams);
}

interface RenderProps<DataType> {
    state: SubStateCoreInfo<UIFragmentSpec, DataType> | null;
    navigationContext: Navigable<UIFragmentSpec, DataType>;
    tokenIncrease?: number;
    extraProps?: any;
    checkCondition?: boolean;
}

export function renderSubStateCore<DataType>(props: RenderProps<DataType>) {
    const { state, navigationContext, tokenIncrease = 0, extraProps = {}, checkCondition } = props;
    const { filterCondition, parsedTokens, fallback, part } = navigationContext;
    if (checkCondition && state && state.data && filterCondition) {
        if (!filterCondition(state.data)) {
            return renderFallback(navigationContext);
        }
    }
    const navigableChildParams: Navigable<UIFragmentSpec, DataType> = {
        parsedTokens: (parsedTokens || 0) + tokenIncrease,
        fallback,
        filterCondition,
        part,
    };
    const childProps = {
        ...extraProps,
        ...navigableChildParams,
    };
    const fragment = extractUIFragmentFromSpec((state || ({} as any)).fragment, fallback, part);
    return renderUIFragment(fragment, childProps);
}
