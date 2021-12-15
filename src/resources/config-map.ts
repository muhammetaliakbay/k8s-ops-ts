import { CoreV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";
import { KObject } from "./object";

export interface ConfigMap extends KObject {
    apiVersion: "v1"
    kind: "ConfigMap"
    data?: ConfigMap.Data
    immutable?: boolean
}

export namespace ConfigMap {
    export type Data = Record<string, string>

    export const Operator: ResourceOperator<ConfigMap, CoreV1Api> = {
        apiVersion: "v1",
        kind: "ConfigMap",
        apiType: CoreV1Api,
        async list(api: CoreV1Api, labelSelector: string) {
            const result = await api.listConfigMapForAllNamespaces(
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as ConfigMap[];
        },
        async delete(api: CoreV1Api, object: ConfigMap) {
            await api.deleteNamespacedConfigMap(
                object.metadata.name,
                object.metadata.namespace,
            )
        },
        async create(api: CoreV1Api, object: ConfigMap) {
            await api.createNamespacedConfigMap(
                object.metadata.namespace,
                object,
            )
        },
        async patch(api: CoreV1Api, object: ConfigMap) {
            await api.patchNamespacedConfigMap(
                object.metadata.name,
                object.metadata.namespace,
                object,
            )
        }
    }
}
