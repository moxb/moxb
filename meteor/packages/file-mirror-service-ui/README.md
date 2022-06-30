# File mirror service - UI

This package provides some easy-to-use widgets for your React application, for delivering mirrored files.
The actual work is done by the `moxb:file-mirror-service` package. This package only provides the React UI.

## Provided widgets

 * `<MirroredImage>` can show a mirrored image, identified by the URL of the original image.
 * `<MirroredResourceDownloadLink>` can create a download link to a mirrored file.

Both components use Meteor methods for loading the information about the mirrored files from the server side.
