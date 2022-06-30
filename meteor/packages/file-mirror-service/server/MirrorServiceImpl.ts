import * as fs from 'fs';
import { FilesCollection } from 'meteor/ostrio:files';
import type { MirroredFileCore, MirroredFileServerInfo, MirrorProps, MirrorService } from '../api';
import { getDebugLogger } from '@moxb/moxb';
import { WebApp } from 'meteor/webapp';

export interface MirrorServiceProps {
    fileStoragePath: string;
    serveManually?: boolean;
    debug?: boolean;
}

export class MirrorServiceImpl<ExtraMeta = {}> implements MirrorService<ExtraMeta> {
    private readonly _collection: FilesCollection<MirroredFileCore & ExtraMeta>;

    constructor(props: MirrorServiceProps) {
        const { fileStoragePath, serveManually = false, debug = false } = props;

        const collectionName = 'mirrored-files';

        this._collection = new FilesCollection<MirroredFileCore & ExtraMeta>({
            collectionName,
            disableDownload: serveManually,
            storagePath: fileStoragePath,
            debug,
        });

        if (serveManually) {
            const servePath = `/cdn/storage/${collectionName}/`;

            WebApp.connectHandlers.use(servePath, (req, res) => {
                const path = req.originalUrl!.substring(servePath.length).split('/');
                const fileName = path[path.length - 1];
                const fullFileName = `${fileStoragePath}/${fileName}`;
                fs.readFile(fullFileName, (err, data) => {
                    if (err) {
                        console.log("Can't load", fullFileName, err);
                        res.end("Can't read file");
                    } else {
                        res.write(data);
                        res.end();
                    }
                });
            });
        }
    }

    mirrorFileAsync(props: MirrorProps<ExtraMeta>) {
        return new Promise<void>((resolve, reject) => {
            const { url, mimetype, logCached, logMissing, meta, headers, overwrite } = props;
            const cachedLogger = getDebugLogger('file-mirror', logCached);
            const missingLogger = getDebugLogger('file-mirror', logMissing);
            const dbEntry = this._collection.findOne({ 'meta.originalUrl': url });
            if (dbEntry) {
                if (overwrite) {
                    cachedLogger.log('File ', url, 'has already been mirrored, but overwriting as required.');
                    this._collection.remove({ _id: dbEntry._id });
                } else {
                    cachedLogger.log('File ', url, 'has already been mirrored, skipping.');
                    resolve();
                    return;
                }
            }

            const fileName = url.substr(url.lastIndexOf('/') + 1);

            missingLogger.log('Should mirror file', url, 'as', fileName);
            this._collection.load(
                url,
                {
                    fileName,
                    headers,
                    type: mimetype,
                    meta: {
                        ...meta,
                        originalUrl: url,
                    },
                },
                (error: object, _result: unknown) => {
                    if (error) {
                        console.log('Failed to get', url);
                        reject(error);
                    } else {
                        console.log('Fetched', url);
                        resolve();
                    }
                }
            );
            // logger.log('Mirrored file', url);
        });
    }

    getFileInfo(originalUrl: string): MirroredFileServerInfo {
        const file = this._collection.findOne({ 'meta.originalUrl': originalUrl });
        if (!file) {
            throw new Error(`No mirror found for ${originalUrl}`);
        }
        const { isVideo, isAudio, isImage, isPDF, isText, isJSON, _fileRef } = file;
        const { path } = _fileRef;
        return {
            path,
            link: file.link(),
            isVideo,
            isAudio,
            isImage,
            isPDF,
            isText,
            isJSON,
        };
    }

    removeFiles(selector: Mongo.Selector<MirroredFileCore & ExtraMeta>) {
        this._collection.remove(selector);
    }

    getStats(selector: Mongo.Selector<MirroredFileCore & ExtraMeta>) {
        const cursor = this._collection.find(selector);
        return {
            'number of files': cursor.count(),
        };
    }
}
