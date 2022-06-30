# File mirror service

This package provides a simple-to-use file mirror service, on top of `ostrio:files`.

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

### To get info about a mirrored file, on the server side:

```typescript
getMirrorService().getFileInfo({ originalUrl: 'http://magic.com/mushroom.jpg'});
```

This will (synchronously) return a bunch of information stored about
the requested file (assuming that we have it),
including file type, local path, and the URL which can be used to access it.

### To get info about a mirrored file, on the client side:

A Meteor method is provided, which can be called:

```typescript
methodGetMirroredFileInfo.callPromise('http://secret.org/leak.txt');
```

This will return a promise, which will (hopefully) resolve to the file info,
which will contain the URL.

As a shortcut for displaying mirrored images and providing working download links,
you can consider using the `@moxb/file-mirror-service-ui` package, which provides
those widgets out of the box.

### Why can't we simply use `FileCollection` for getting the data from the server to the client, as provided by `ostrio:files` ?

In one word: **performance**!

According to my tests, when we have a file collection with hundreds of thousands of files,
simply publishing that collection to the client causes a _huge_ slow-down.

Keeping the data on the server, and introducing a method for client access saves the day.
