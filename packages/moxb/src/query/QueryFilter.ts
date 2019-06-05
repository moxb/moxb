export interface QueryString {
    getQuery(): string;
    setQuery(query: string): void;
}

export interface EqualsCondition {
    type: 'equals';
    field: string;
    value: string;
}

export type Condition = EqualsCondition;

export interface QueryFilter {
    readonly queryString: QueryString;
    addCondition(condition: Condition): void;
    removeCondition(condition: Condition): void;
    toggleCondition(condition: Condition): void;
    hasCondition(condition: Condition): boolean;
}
