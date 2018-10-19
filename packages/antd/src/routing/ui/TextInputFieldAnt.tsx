import * as React from "react";
import { Input } from "antd";

export interface TextInputProps {
    id: string;
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

export class TextInputFieldAnt extends React.Component<TextInputProps, {}> {

    public constructor(props: TextInputProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { onChange } = this.props;
        onChange(e.target.value);
    }

    public render() {
        const { id, value, placeholder } = this.props;
        return (
                <Input
                    id={id}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={ this.handleChange }
                />
        );
    }
}
