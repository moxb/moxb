# Shards - Meteor Process Manager: server features

This family of packages provides a framework for Meteor projects that allows running tasks in the background.

## Overview

See [@moxb/shards-meteor-process-manager-core](https://www.npmjs.com/package/@moxb/shards-meteor-process-manager-core)
for a description of some basic terms.

### Roles

Your app can run in one of two different roles:
 * Controller: There can be only one. Controls the execution of the tasks. Sends requests to the workers.
 * Worker: There can be more than one. Takes requests from the controller and executes processes.

The idea is that the same Meteor application can be executed on multiple nodes simultaneously, in different roles.

### Running a worker node

```typescript
// Define our processes
const processBreedSheep = { ... };
const processCountSheep = { ... };
const processButcherSheep = { ... };

// Launch a worker node
initProcessManagerWorker({
    getScopeData: () => {},
    getProcessList: () => [ // enumerate our processes
        processBreedSheep,
        processCountSheep,
        processButcherSheep,
    ],
});
```

See [ProcessManagerWorkerProps](https://github.com/moxb/moxb/tree/master/packages/shards-meteor-process-manager-server/src/worker.ts) for more details.

### Running a controller node

```typescript
initProcessManagerController();
```

See [ProcessManagerControllerProps](https://github.com/moxb/moxb/tree/master/packages/shards-meteor-process-manager-server/src/controller.ts) for more details.

### Communication between the nodes

All nodes should have access to the same MongoDB instance. For best (fastest) result, the OpLog support should be enabled, and it should be part of the MongoURL provided to the meteor nodes.

### Meteor users, ScopeId, Scope, ScopeData, authorization

TODO

## See also

* [@moxb/shards-meteor-process-manager-core](https://www.npmjs.com/package/@moxb/shards-meteor-process-manager-core)
  for the core concepts
* [@moxb/shards-meteor-process-manager-antd](https://www.npmjs.com/package/@moxb/shards-meteor-process-manager-atnd)
  for an out-of-the-box GUI for controlling the processes
