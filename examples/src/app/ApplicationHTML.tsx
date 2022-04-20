import { toJSON } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

// helper function to print recursive mobx trees
(window as any).js = function (value: any, ignore = /\b(store|storage)\b/) {
    return toJSON(value, ignore);
};

export const ApplicationHTML = observer(() => (
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
));
