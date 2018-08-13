// this declares new methods and attributes to the mongo database
declare module 'meteor/mongo' {
    export namespace Mongo {
        export interface Collection<T> {
            attachSchema(schema: SimpleSchemaModule.SimpleSchema, options?: SimpleSchemaOptions): any;
            do: any;
            _ensureIndex(keys: { [key: string]: number }, options?: { [key: string]: any }): void;
        }
        export interface FindOneOptions {
            sort?: SortSpecifier;
            skip?: number;
            fields?: FieldSpecifier;
            reactive?: boolean;
            transform?: Function;
        }
        export interface FindOptions extends FindOneOptions {
            limit?: number;
        }
    }
}
