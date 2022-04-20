// import { ActionButtonHtml, ActionAnchorHtml } from '@moxb/html/dist/ActionHtml';
import { toJSON } from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Application } from './Application';

// helper function to print recursive mobx trees
(window as any).js = function (value: any, ignore = /\b(store|storage)\b/) {
    return toJSON(value, ignore);
};

export const ApplicationHTML = inject('app')(
    observer(class ApplicationHTML extends React.Component<{ app?: Application }> {
        render() {
            // const application = this.props.app!;
            return (
                <main>
                    <section>
                        <h1>HTML Components</h1>
                        <hr />
                        <h3>ActionButtonUI Component</h3>
                        {/*<ActionButtonHtml operation={application.testAction} />*/}
                        <br />
                        <br />
                        <h3>ActionFormButtonUI Component</h3>
                        {/*<ActionAnchorHtml operation={application.testAction} />*/}
                        <br />
                        <br />
                    </section>
                </main>
            );
        }
    })
);
