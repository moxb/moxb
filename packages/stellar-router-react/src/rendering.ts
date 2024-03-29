import { Navigable, NavigableContent, SubStateCoreInfo, NavControl } from '@moxb/stellar-router-core';
import { renderUIFragment, UIFragmentSpec, extractUIFragmentFromSpec } from '@moxb/react-html';

/**
 * Render the fallback widget.
 *
 * This is an implementation detail, not to be used by application code.
 */
export function renderFallback(props: Navigable<any>, fallback: UIFragmentSpec | undefined) {
    const { filterCondition, part, parsedTokens } = props;
    const navigableChildParams: Navigable<any> = {
        parsedTokens,
        filterCondition,
        part,
    };
    const fallbackFragment = extractUIFragmentFromSpec({}, fallback, part);
    return renderUIFragment(fallbackFragment, navigableChildParams);
}

interface RenderProps<DataType> {
    state: SubStateCoreInfo<UIFragmentSpec, DataType> | null;
    fallback?: UIFragmentSpec;
    navigationContext: Navigable<DataType>;
    tokenIncrease?: number;
    extraProps?: any;
    checkCondition?: boolean;
    navControl: NavControl;
}

/**
 * Render content for a given sub-state.
 *
 * This is an implementation detail, not to be used by application code.
 */
export function renderSubStateCore<DataType>(props: RenderProps<DataType>) {
    const {
        state,
        fallback,
        navigationContext,
        tokenIncrease = 0,
        extraProps = {},
        checkCondition,
        navControl,
    } = props;
    const { filterCondition, parsedTokens, part } = navigationContext;
    if (checkCondition && state && state.data && filterCondition) {
        if (!filterCondition(state.data)) {
            return renderFallback(navigationContext, fallback);
        }
    }
    const navigableChildParams: NavigableContent<DataType> = {
        parsedTokens: (parsedTokens || 0) + tokenIncrease,
        filterCondition,
        part,
        navControl,
    };
    const childProps = {
        ...extraProps,
        ...navigableChildParams,
    };
    const fragment = extractUIFragmentFromSpec((state || ({} as any)).fragment, fallback, part);
    return renderUIFragment(fragment, childProps);
}
