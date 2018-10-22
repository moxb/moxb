import * as React from 'react';
import { observer } from 'mobx-react';
import { UrlArg } from '@moxb/moxb';

import { TextInputProps, TextInputFieldAnt } from './TextInputFieldAnt';

export interface UrlTextFieldProps {
    id: string;
    placeholder?: string;
    arg: UrlArg<string>;
}

@observer
export class UrlTextFieldAnt extends React.Component<UrlTextFieldProps, {}> {
    public handleChange(value: string) {
        this.props.arg.value = value;
    }

    public constructor(props: UrlTextFieldProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const { id, arg, placeholder } = this.props;
        const uiProps: TextInputProps = {
            id,
            value: arg.value,
            placeholder,
            onChange: this.handleChange,
        };
        return <TextInputFieldAnt {...uiProps} />;
    }
}
