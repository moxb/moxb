# Shards - Meteor Process Manager: AntD UI

This family of packages provides a framework for Meteor projects that allows running tasks in the background.

## Overview

* See [@moxb/shards-meteor-process-manager-core](https://www.npmjs.com/package/@moxb/shards-meteor-process-manager-core)
for a description of some basic terms.
* See [@moxb/shards-meteor-process-manager-server](https://www.npmjs.com/package/@moxb/shards-meteor-process-manager-server)
about the server integration.
* This packages provides a UI for managing the processes.

## Usage

Just use the React component.

```typescript jsx
const ProcessPage = () => (
    <div>
        <h2>Process Maanger</h2>
        <ProcessManagerUI scopeId="basic" />
    </div>
);
```
