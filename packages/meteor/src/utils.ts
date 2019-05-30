/** Deeply get a value from an object via its path. */
export function getIn(obj: any, key: string) {
    const path = key.split('.');
    let i = 0;
    let result = obj;
    while (result && i < path.length) {
        result = result[path[i]];
        i++;
    }
    return result;
}

/** Checks if the given object contains the given nested key. */
export function isIn(obj: any, key: string): boolean {
    const path = key.split('.');
    let i = 0;
    let value = obj;
    while (value && i < path.length) {
        const pathKey = path[i];
        if (!(pathKey in value)) {
            return false;
        }
        value = value[pathKey];
        i++;
    }
    return true;
}

export function setIn(obj: any, key: string, value: any): any {
    const path = key.split('.');
    let i = 0;
    let parent = obj;
    while (parent && i < path.length) {
        const pathKey = path[i];
        if (i === path.length - 1) {
            parent[pathKey] = value;
        } else if (typeof parent[pathKey] !== 'object' || parent[pathKey] == null) {
            parent[pathKey] = {};
        }
        parent = parent[pathKey];
        i++;
    }

    return obj;
}
