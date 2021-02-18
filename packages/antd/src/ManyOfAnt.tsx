import { idToDomId, ManyOf } from '@moxb/moxb';
import { Checkbox, Col, Row, Select, Switch } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, labelWithHelp, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { SelectProps } from 'antd/lib/select';
import { AllowedSwitchProps } from './BoolAnt';

@observer
export class ManyOfAnt extends React.Component<BindAntProps<ManyOf> & SelectProps<any>> {
    render() {
        const { operation, invisible, mode, children, defaultValue, reason, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <span title={reason}>
                <Select
                    data-testid={operation.id}
                    onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                    value={value || undefined}
                    placeholder={operation.placeholder}
                    defaultValue={defaultValue}
                    mode={mode}
                    {...props}
                >
                    {operation.choices.map((opt: any) => (
                        <Select.Option
                            data-testid={idToDomId(operation.id + '.' + opt.value)}
                            key={opt.value}
                            value={opt.value}
                        >
                            {opt.label}
                        </Select.Option>
                    ))}
                    {children}
                </Select>
            </span>
        );
    }
}

export interface ManyOfCheckboxAntProps {
    /**
     * Should we align the items vertically, instead of horizontally?
     */
    vertical?: boolean;
}

@observer
export class ManyOfCheckboxAnt extends React.Component<
    BindAntProps<ManyOf> & CheckboxGroupProps & ManyOfCheckboxAntProps
> {
    render() {
        const { operation, invisible, children, defaultValue, reason, vertical, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);

        const choices = vertical
            ? operation.choices.map((opt: any) => (
                  <Row title={reason} key={opt.value} style={{ width: '100%' }}>
                      <Col span={24}>
                          <Checkbox data-testid={idToDomId(operation.id + '.' + opt.value)} value={opt.value}>
                              {labelWithHelp(opt.label, opt.help)}
                          </Checkbox>
                      </Col>
                  </Row>
              ))
            : operation.choices.map((opt: any) => (
                  <Col title={reason} key={opt.value}>
                      <Checkbox data-testid={idToDomId(operation.id + '.' + opt.value)} value={opt.value}>
                          {labelWithHelp(opt.label, opt.help)}
                      </Checkbox>
                  </Col>
              ));

        return (
            <Checkbox.Group
                data-testid={operation.id}
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value}
                defaultValue={defaultValue}
                {...props}
            >
                <Row>
                    {choices}
                    {children}
                </Row>
            </Checkbox.Group>
        );
    }
}

@observer
export class ManyOfFormAnt extends React.Component<SelectProps<ManyOf> & BindAntProps<ManyOf> & BindFormItemAntProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <ManyOfAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class ManyOfCheckboxFormAnt extends React.Component<
    CheckboxGroupProps & BindAntProps<ManyOf> & BindFormItemAntProps & ManyOfCheckboxAnt
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <ManyOfCheckboxAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

export interface ManyOfSwitchAntProps {
    /**
     * Should we align the choices vertically, instead of horizontelly?
     */
    vertical?: boolean;
}

@observer
export class ManyOfSwitchAnt extends React.Component<BindAntProps<ManyOf> & AllowedSwitchProps & ManyOfSwitchAntProps> {
    private _toggle(value: string) {
        const { operation, readOnly, disabled } = parseProps(this.props, this.props.operation);
        if (readOnly || disabled) {
        } else {
            operation.toggle(value);
        }
    }

    private readonly _switchHandlerCache: Record<string, SwitchChangeEventHandler> = {};

    private _getSwitchHandler(value: string): SwitchChangeEventHandler {
        let result = this._switchHandlerCache[value];
        if (!result) {
            result = this._switchHandlerCache[value] = () => {
                this._toggle(value);
            };
        }
        return result;
    }

    private readonly _clickHandlers: Record<string, React.MouseEventHandler> = {};

    private _getClickHandler(value: string): React.MouseEventHandler {
        let result = this._clickHandlers[value];
        if (!result) {
            result = this._clickHandlers[value] = () => {
                this._toggle(value);
            };
        }
        return result;
    }

    render() {
        const { operation, invisible, disabled, children, vertical, reason, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        const switchClassName = disabled ? 'ant-checkbox-disabled' : '';
        const labelClassName = disabled ? '' : 'ant-checkbox-wrapper';

        const choices = vertical
            ? operation.choices.map((opt: any) => (
                  <Row key={opt.value} style={{ width: '100%' }}>
                      <Col span={24}>
                          <span title={reason}>
                              <span className={switchClassName}>
                                  <Switch
                                      data-testid={idToDomId(operation.id + '.' + opt.value)}
                                      checked={operation.isSelected(opt.value)}
                                      onChange={this._getSwitchHandler(opt.value)}
                                      disabled={disabled}
                                      size={'small'}
                                      {...props}
                                  />
                              </span>
                              &nbsp; &nbsp;
                              <span onClick={this._getClickHandler(opt.value)} className={labelClassName}>
                                  {labelWithHelp(opt.label, opt.help)}
                              </span>
                          </span>
                      </Col>
                  </Row>
              ))
            : operation.choices.map((opt: any) => (
                  <Col key={opt.value}>
                      <span title={reason}>
                          <span className={switchClassName}>
                              <Switch
                                  data-testid={idToDomId(operation.id + '.' + opt.value)}
                                  checked={operation.isSelected(opt.value)}
                                  onChange={this._getSwitchHandler(opt.value)}
                                  disabled={disabled}
                                  size={'small'}
                                  {...props}
                              />
                          </span>
                          &nbsp; &nbsp;
                          <span onClick={this._getClickHandler(opt.value)} className={labelClassName}>
                              {labelWithHelp(opt.label, opt.help)}
                          </span>
                          &nbsp; &nbsp; &nbsp; &nbsp;
                      </span>
                  </Col>
              ));

        return (
            <Row>
                {choices}
                {children}
            </Row>
        );
    }
}

@observer
export class ManyOfSwitchFormAnt extends React.Component<
    AllowedSwitchProps & BindAntProps<ManyOf> & BindFormItemAntProps & ManyOfSwitchAntProps
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <ManyOfSwitchAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
