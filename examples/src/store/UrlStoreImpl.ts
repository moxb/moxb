import { UrlArg, URLARG_TYPE_STRING, LocationManager } from "@moxb/moxb";
import { UrlStore } from "./UrlStore";

export class UrlStoreImpl implements UrlStore {
    
    public readonly color: UrlArg<string>;
    public readonly search: UrlArg<string>;

    public constructor(location: LocationManager) {
        this.color = new UrlArg(location, {
            key: "color";
            valueType: URLARG_TYPE_STRING,
            defaultValue: "red",
        });

        this.search = new UrlArg(location, {
            key: "search";
            valueType: URLARG_TYPE_STRING,
            defaultValue: "",
        });
    }
}
