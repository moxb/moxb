import { Condition, QueryFilter, QueryString } from './QueryFilter';

/**
 * Quotes a string if it contains whitespace or other 'strange' characters
 * @param string
 */
function quoteStringIfNeeded(string: string) {
    if (string.match(/[\s"\\]/)) {
        return '"' + string.replace(/(["\\])/g, '\\$1') + '"';
    }
    return string;
}

const STRINGIFIERS: { [type: string]: (condition: Condition) => string } = {
    equals(condition: Condition) {
        const value = quoteStringIfNeeded(condition.value);
        return `${condition.field}:${value}`;
    },
};

function toString(condition: Condition): string {
    const stringifier = STRINGIFIERS[condition.type];
    if (!stringifier) {
        throw new Error(`Unknown condition type: ${condition.type}`);
    }

    return stringifier(condition);
}

export class QueryFilterImpl implements QueryFilter {
    constructor(public readonly queryString: QueryString) {}

    addCondition(condition: Condition): void {
        // do not add the same condition multiple times
        if (this.hasCondition(condition)) {
            return;
        }
        const query = `${this.queryString.getQuery()} ${toString(condition)} `.trim();
        this.queryString.setQuery(query);
    }

    removeCondition(condition: Condition): void {
        const query = ` ${this.queryString.getQuery()} `.replace(` ${toString(condition)} `, ' ').trim();
        this.queryString.setQuery(query);
    }

    toggleCondition(condition: Condition): void {
        // pad with spaces so we can catch the query at the begining, in the middle, or at the end of the condition
        const padded = ` ${this.queryString.getQuery()} `;
        const conditionString = toString(condition);
        if (padded.includes(` ${conditionString} `)) {
            this.queryString.setQuery(padded.replace(` ${conditionString} `, ' ').trim());
        } else {
            this.queryString.setQuery(`${padded}${conditionString}`.trim());
        }
    }

    hasCondition(condition: Condition): boolean {
        const padded = ` ${this.queryString.getQuery()} `;
        return padded.includes(` ${toString(condition)} `);
    }
}
