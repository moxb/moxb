import { BindImpl, ConfirmImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ConfirmAnt } from '../ConfirmAnt';
import { shallowMoxbToJson } from './enzymeHelper';

describe('ConfirmAnt', function() {
    it('should render a confirm dialog by default', function() {
        const operation = new ConfirmImpl<any>({
            cancelButton: new BindImpl({
                id: 'ApplicationImpl.noConfirm',
                label: 'Cancel',
            }),
            confirmButton: new BindImpl({
                id: 'ApplicationImpl.yesConfirm',
                label: 'Do the action',
            }),
            content: () => 'Do you really want to execute the action?',
            header: () => 'Confirm dialog',
            confirm: () => alert('You confirmed the action'),
        });
        expect(shallowMoxbToJson(shallow(<ConfirmAnt operation={operation} />))).toMatchSnapshot();
    });
});
