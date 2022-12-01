import { CachedValueImpl } from './CachedValueImpl';
import { CachedValue, CachedValueProps } from './CachedValue';

import { CachedEvaluatorImpl } from './CachedEvaluatorImpl';
import { CachedEvaluator, CachedEvaluatorProps } from './CachedEvaluator';
import { CachedOptionalValue, CachedOptionalValueProps } from './CachedOptionalValue';
import { CachedOptionalValueImpl } from './CachedOptionalValueImpl';

export function getCachedValue<Output>(props: CachedValueProps<Output>): CachedValue<Output> {
    return new CachedValueImpl<Output>(props);
}

export function getCachedOptionalValue<Output>(props: CachedOptionalValueProps<Output>): CachedOptionalValue<Output> {
    return new CachedOptionalValueImpl<Output>(props);
}

export function getCachedEvaluator<Input, Output>(
    props: CachedEvaluatorProps<Input, Output>
): CachedEvaluator<Input, Output> {
    return new CachedEvaluatorImpl<Input, Output>(props);
}
