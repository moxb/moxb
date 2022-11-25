import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '/imports/ui/App';

Meteor.startup(() => {
    createRoot(document.getElementById('react-target')).render(<App/>);
});
