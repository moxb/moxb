# File mirror service

This package provides a simple-to-use file mirror service, on top ot `ostrio:files`.

## Quick start guide

In your server boot-up code, do something like this:
``` typescript
import { createMirrorService } from 'meteor/moxb:file-mirror-service';

Meteor.startup(() => {
    const fileStoragePath = process.env[PATH_VAR_NAME];

    if (!fileStoragePath) {
        throw new Error(`"Please configure the ${PATH_VAR_NAME} env variable!`);
    }
    createMirrorService({
        fileStoragePath,
    });
}); 
``` 

After this, you can access the service via `getMirrorService()`.

### To mirror a file:

``` typescript
getMirrorService().mirrorFileAsync({ url: 'http://whatever.com/image.jpg'});
`````

This will return a promise.

### To get info about a mirrored file:

```typescript
getMirrorService().getFileInfo({ originalUrl: 'http://magic.com/mushroom.jpg'});
```

This will (synchronously) return a bunch of information stored about
the requested file (assuming that we have it),
including file type, local path, and the URL which can be used to access it.

