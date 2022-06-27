import { ShallowWrapper } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { toJS } from 'mobx';

function simplifyOperation(operation: any) {
    if (!operation) {
        return operation;
    }
    if (operation.constructor) {
        return operation.constructor.name;
    }
    return toJS(operation);
}

/**
 * This strips away the operation (Bind) form the properties. There is no need
 * in the snapshot to show the operation details, because it contains strange
 * artifacts form moxb that are not stable
 * @param wrapper
 */
export function shallowMoxbToJson(wrapper: ShallowWrapper) {
    return shallowToJson(wrapper, {
        noKey: false,
        map: (value: any) => {
            const { props, ...rest } = value;
            if (props.operation) {
                return {
                    ...rest,
                    props: {
                        ...props,
                        operation: simplifyOperation(props.operation),
                    },
                };
            }
            return value;
        },
    });
}
