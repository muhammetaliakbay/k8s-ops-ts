import { KObject } from "./object";

export interface ConfigMap extends KObject {
    apiVersion: "v1"
    kind: "ConfigMap"
    data?: ConfigMap.Data
    immutable?: boolean
}

export namespace ConfigMap {
    export type Data = Record<string, string> 
}
