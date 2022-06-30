const styleRegex = new RegExp(/[A-Z]/g);
const kebabCase = (str: string) => str.replace(styleRegex, (v) => `-${v.toLowerCase()}`);

/**
 * Convert a React.CSSProperties style object to a string style value
 */
export const styleToString = (style: React.CSSProperties) =>
    Object.keys(style).reduce((accumulator, key) => {
        const cssKey = kebabCase(key);
        const cssValue = (style as any)[key].replace("'", '');
        return `${accumulator}${cssKey}:${cssValue};`;
    }, '');
