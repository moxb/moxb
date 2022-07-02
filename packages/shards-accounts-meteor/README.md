# Shards - User accounts by Meteor

This package provides a Meteor-based authentication backend for
[@moxb/shards-accounts-flow-antd](https://www.npmjs.com/package/@moxb/shards-accounts-flow-antd).

**This is considered to be W.I.P.**

## Quick start

### Client side:

```typescript
import {MeteorAuthBackend} from '@moxb/shards-accounts-meteor';

const authBackend = new MeteorAuthBackend();
```

... and then pass this backend to `<WithLoginFlow>`.

### Server side:

```typescript
import {setupUserAccounts} from '@moxb/shards-accounts-meteor/dist/server';

setupUserAccounts()
```

This is required to set up the paths that will go into the various account-related emails
so that it matches with the client-side routing.
