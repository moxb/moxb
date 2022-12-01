import * as React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { idToDomId } from '@moxb/util';
import { ManyOf } from '@moxb/moxb';

import { Checkbox, Col, Row, Select, Switch } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { SwitchChangeEventHandler } from 'antd/lib/switch';

import { BindAntProps, labelWithHelpIndicator, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { SelectProps } from 'antd/lib/select';
import { AllowedSwitchProps } from './BoolAnt';

export const ManyOfAnt = observer((props: BindAntProps<ManyOf> & SelectProps) => {
    const { operation, invisible, mode, children, defaultValue, reason, ...rest } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }
    // make sure the value is not a mobx object...
    const value = toJS(operation.value);

    return (
        <span title={reason}>
            <Select
                data-testid={operation.id}
                onChange={(selectionValue: string | string[]) => {
                    if (Array.isArray(selectionValue)) {
                        // We have received an array of all the current selections
                        operation.setValue(selectionValue);
                    } else {
                        // We have received only a single value
                        operation.toggle(selectionValue);
                    }
                }}
                value={value || undefined}
                placeholder={operation.placeholder}
                defaultValue={defaultValue}
                mode={mode}
                {...rest}
            >
                {operation.choices.map((opt: any) => (
                    <Select.Option
                        data-testid={idToDomId(operation.id + '.' + opt.value)}
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                        title={opt.reason || opt.help}
                    >
                        {labelWithHelpIndicator(opt.label, opt.help)}
                    </Select.Option>
                ))}
                {children}
            </Select>
        </span>
    );
});

export interface ManyOfCheckboxAntProps {
    /**
     * Should we align the items vertically, instead of horizontally?
     */
    vertical?: boolean;
}

export const ManyOfCheckboxAnt = observer(
    (props: BindAntProps<ManyOf> & CheckboxGroupProps & ManyOfCheckboxAntProps) => {
        const { operation, invisible, children, defaultValue, reason, vertical, ...rest } = parseProps(
            props,
            props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);

        const choices = vertical
            ? operation.choices.map((opt: any) => (
                  <Row title={reason || opt.reason || opt.help} key={opt.value} style={{ width: '100%' }}>
                      <Col span={24}>
                          <Checkbox
                              data-testid={idToDomId(operation.id + '.' + opt.value)}
                              value={opt.value}
                              disabled={opt.disabled}
                          >
                              {labelWithHelpIndicator(opt.label, opt.help)}
                          </Checkbox>
                      </Col>
                  </Row>
              ))
            : operation.choices.map((opt: any) => (
                  <Col title={reason || opt.reason || opt.help} key={opt.value}>
                      <Checkbox
                          data-testid={idToDomId(operation.id + '.' + opt.value)}
                          value={opt.value}
                          disabled={opt.disabled}
                      >
                          {labelWithHelpIndicator(opt.label, opt.help)}
                      </Checkbox>
                  </Col>
              ));

        return (
            <Checkbox.Group
                data-testid={operation.id}
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value}
                defaultValue={defaultValue}
                {...rest}
            >
                <Row>
                    {choices}
                    {children}
                </Row>
            </Checkbox.Group>
        );
    }
);

export const ManyOfFormAnt = observer((props: SelectProps<ManyOf> & BindAntProps<ManyOf> & BindFormItemAntProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <ManyOfAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});

export const ManyOfCheckboxFormAnt = observer(
    (props: CheckboxGroupProps & BindAntProps<ManyOf> & BindFormItemAntProps & ManyOfCheckboxAntProps) => {
        const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(props as any)}>
                <ManyOfCheckboxAnt operation={operation} {...rest} />
            </FormItemAnt>
        );
    }
);

export interface ManyOfSwitchAntProps {
    /**
     * Should we align the choices vertically, instead of horizontally?
     */
    vertical?: boolean;
}

export const ManyOfSwitchAnt = observer((props: BindAntProps<ManyOf> & AllowedSwitchProps & ManyOfSwitchAntProps) => {
    const { operation, invisible, disabled, children, vertical, reason, ...rest } = parseProps(props, props.operation);

    function toggle(value: string) {
        const { readOnly } = parseProps(props, props.operation);
        if (readOnly || disabled) {
            // nothing to do here
        } else {
            operation.toggle(value);
        }
    }

    const switchHandlerCache: Record<string, SwitchChangeEventHandler> = {};

    function getSwitchHandler(value: string): SwitchChangeEventHandler {
        let result = switchHandlerCache[value];
        if (!result) {
            result = switchHandlerCache[value] = () => {
                toggle(value);
            };
        }
        return result;
    }

    const clickHandlers: Record<string, React.MouseEventHandler> = {};

    function getClickHandler(value: string): React.MouseEventHandler {
        let result = clickHandlers[value];
        if (!result) {
            result = clickHandlers[value] = () => {
                toggle(value);
            };
        }
        return result;
    }

    if (invisible || operation.invisible) {
        return null;
    }

    const choices = vertical
        ? operation.choices.map((opt: any) => (
              <Row key={opt.value} style={{ width: '100%' }}>
                  <Col span={24}>
                      <span title={reason || opt.reason || opt.help}>
                          <span className={disabled || opt.disabled ? 'ant-checkbox-disabled' : ''}>
                              <Switch
                                  data-testid={idToDomId(operation.id + '.' + opt.value)}
                                  checked={operation.isSelected(opt.value)}
                                  onChange={getSwitchHandler(opt.value)}
                                  disabled={disabled || opt.disabled}
                                  size={'small'}
                                  {...rest}
                              />
                          </span>
                          &nbsp; &nbsp;
                          <span
                              onClick={getClickHandler(opt.value)}
                              className={disabled || opt.disabled ? '' : 'ant-checkbox-wrapper'}
                          >
                              {labelWithHelpIndicator(opt.label, opt.help)}
                          </span>
                      </span>
                  </Col>
              </Row>
          ))
        : operation.choices.map((opt: any) => (
              <Col key={opt.value}>
                  <span title={reason || opt.reason || opt.help}>
                      <span className={disabled || opt.disabled ? 'ant-checkbox-disabled' : ''}>
                          <Switch
                              data-testid={idToDomId(operation.id + '.' + opt.value)}
                              checked={operation.isSelected(opt.value)}
                              onChange={getSwitchHandler(opt.value)}
                              disabled={disabled || opt.disabled}
                              size={'small'}
                              {...rest}
                          />
                      </span>
                      &nbsp; &nbsp;
                      <span
                          onClick={getClickHandler(opt.value)}
                          className={disabled || opt.disabled ? '' : 'ant-checkbox-wrapper'}
                      >
                          {labelWithHelpIndicator(opt.label, opt.help)}
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
});

export const ManyOfSwitchFormAnt = observer(
    (props: AllowedSwitchProps & BindAntProps<ManyOf> & BindFormItemAntProps & ManyOfSwitchAntProps) => {
        const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(props as any)}>
                <ManyOfSwitchAnt operation={operation} {...rest} />
            </FormItemAnt>
        );
    }
);
