import { ApiType } from "@kubernetes/client-node";
import { KObject } from "./resources/object";

export type ApiConstructor<T extends ApiType> = new (server: string) => T;

export interface ResourceOperator<T extends KObject, API extends ApiType> {
    apiVersion: KObject.ApiVersion<T>
    kind: KObject.Kind<T>
    apiType: ApiConstructor<API>

    list(api: API, labelSelector: string): Promise<T[]>;
    delete(api: API, object: T): Promise<void>;
    create(api: API, object: T): Promise<void>;
    patch?(api: API, object: T): Promise<void>;
}
