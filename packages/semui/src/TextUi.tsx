import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormInputProps } from 'semantic-ui-react';
import { labelWithHelp, parseProps } from './BindUi';
import { Text } from '@moxb/moxb';

export interface BindStringUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;
}

@observer
export class TextUi extends React.Component<FormInputProps & BindStringUiProps> {
    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        const { operation, id, type, width, value, label, size, invisible, ...props } = parseProps(this.props);
        if (invisible) {
            return null;
        }
        return (
            <Form.Field
                id={id}
                error={operation.error != null}
                type={type || operation.inputType || undefined}
                label={labelWithHelp(label != null ? label : operation.label, operation.help)}
                placeholder={operation.placeholder}
                control={operation.control || 'input'}
                value={operation.value || value || ''}
                onChange={(e: any) => operation.setValue(e.target.value)}
                onFocus={operation.onEnterField}
                onBlur={operation.onExitField}
                {...props}
                width={width as any}
                size={size as any}
                fluid={operation.value || value || ''}
            />
        );
    }
}
