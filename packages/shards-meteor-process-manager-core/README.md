# Shards - Meteor Process Manager: core

This family of packages provides a framework for Meteor projects that allows running tasks in the background.

## Overview

### Task Definition

Tasks are described using a specific interface. Basic example:

```typescript
const processCountSheep: ProcessDefinition = {
  processId: 'count-sheep',
  name: "Count sheep",
  detailLevel: 1,
  execute: () => {
      // 1
      sleep(1);
      // 2
      sleep(2);
      // 3
  }
};
```

See [ProcessDefinition](https://github.com/moxb/moxb/tree/master/packages/shards-meteor-process-manager-core/src/types/ProcessDefinition.ts) for more.

### Process Context

When a process is executed, it gets `ProcessContext` instance, which provides some APIs for communicating
with the process manager.

```typescript
function someProcess(context: ProcessContext<any>) {
    sleep(1);
    context.reportProgress("One", 0.1);
    sleep(1);
    context.reportProgress("Two", 0.2);
    sleep(1);
}
```

See [ProcessContext](https://github.com/moxb/moxb/tree/master/packages/shards-meteor-process-manager-core/src/types/ProcessContext.ts) for more.

### Process Controller

The process controller is a singleton object, living on the server side.
It's responsible for controlling what happens around the processes.

The application code running on the server side can talk to this controller:

```typescript
getProcessController().launchProcess("basic", "count-sheep");
getProcessController().stopProcess("basic", "count-sheep");
```

See [ProcessController](https://github.com/moxb/moxb/tree/master/packages/shards-meteor-process-manager-core/src/types/ProcessController.ts) for more.

The application code on the client side can talk to the process controller
using a set of Meteor methods:

```typescript
launchProcessMethod.call({ scopeId: "basic", processId: "count-sheep" });
stopProcessMethod.call({ scopeId: "basic", processId: "count-sheep" });
```

### Examining process status

We store the status of each of the defined processes.

```typescript
console.log(getProcessController().getProcess("basic", "count-sheep");
```

See [ProcessStatus](https://github.com/moxb/moxb/tree/master/packages/shards-meteor-process-manager-core/src/types/ProcessStatus.ts) for the exact details.

As far as the client is concerned, `publicationBackgroundProcesses` is a Meteor publication
carries all process status info from the server to the client.

## See also

* [@moxb/shards-meteor-process-manager-server](https://www.npmjs.com/package/@moxb/shards-meteor-process-manager-server)
  for integrating the process manager into your application server
* [@moxb/shards-meteor-process-manager-antd](https://www.npmjs.com/package/@moxb/shards-meteor-process-manager-atnd)
  for an out-of-the-box GUI for controlling the processes
