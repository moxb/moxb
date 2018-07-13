


// this declares new methods and attributes to the mongo database
declare module 'meteor/mongo' {
    // https://github.com/aldeed/meteor-collection2#attachschema-options
    export interface SimpleSchemaOptions {
        transform?:boolean;
        replace?:boolean;
    }
    export namespace Mongo {
        export interface Collection<T> {
            attachSchema(schema:SimpleSchemaModule.SimpleSchema, options?:SimpleSchemaOptions):any;
            'do': any;
            _ensureIndex(keys:{ [key: string]: number }, options?: { [key: string]: any }): void;

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

// https://github.com/matb33/meteor-collection-hooks/
declare module 'meteor/mongo' {

    export namespace Mongo {
        interface SimpleSchemaUpdateOptions {
            multi?: boolean;
            upsert?: boolean;
            // the options below are form SimpleSchema
            // https://github.com/aldeed/meteor-collection2#inserting-or-updating-without-cleaning
            validate?: boolean;
            filter?: boolean;
            removeEmptyStrings?:boolean;
            trimStrings?:boolean;
            bypassCollection2?:boolean;
            getAutoValues?:boolean;

        }
        export interface Collection<T> {
            insert(doc:T, options?: {
                removeEmptyStrings?:boolean;
                validate?: boolean;
                filter?: boolean;
            }): string;
            update(selector: Selector | ObjectID | string, modifier: Modifier, options?: SimpleSchemaUpdateOptions, callback?: Function): number;
            upsert(selector: Selector | ObjectID | string, modifier: Modifier, options?: SimpleSchemaUpdateOptions, callback?: Function): number;
        }
    }
}
declare module 'meteor/meteor' {
    export namespace Meteor {
        interface User {
            roles:{
                [index:string]:string[];
            }
        }
        // see https://github.com/deanius/meteor-promise
        // see https://atmospherejs.com/deanius/promise
        function callPromise(name: string, ...args: any[]): Promise;
        function apply(name: string, args: EJSONable[], asyncCallback?: Function): any;
    }
}
// https://docs.meteor.com/api/assets.html
// > Currently, it is not possible to import Assets as an ES6 module. Any of the Assets methods
// > below can simply be called directly in any Meteor server code.
declare namespace Assets {
    function getBinary(assetPath: string, asyncCallback?: Function): EJSON;
    function getText(assetPath: string, asyncCallback?: Function): string;
    function absoluteFilePath(assetPath: string): string;
}

interface MethodThis {
    userId:string;
    unblock():void;
    isSimulation:boolean;
}


// added by `csillag:find-from-publication`
declare module 'meteor/mongo' {
    export namespace Mongo {
        export interface Collection<T> {
            findFromPublication(name:string, query?:any, options?:any):any;
            findOneFromPublication(name:string, query?:any, options?:any):any;
        }
    }
}

declare module 'meteor/email' {
    export namespace EmailTest {
        function hookSend (f:(email:any)=>void):void;
    }
}

declare module 'mongo-mock';

declare module 'pretty';
