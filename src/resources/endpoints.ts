import { CoreV1Api } from "@kubernetes/client-node";
import { KObject } from "..";
import { ResourceOperator } from "../resource-operator";

export interface Endpoints extends KObject {
    apiVersion: "v1"
    kind: "Endpoints"
    subsets?: Endpoints.Subset[]
}

export namespace Endpoints {
    export interface Address {
        ip: string
        hostname?: string
        nodeName?: string
    }

    export enum Protocol {
        UDFP = "UDP",
        TCP = "TCP",
        SCTP = "SCTP",
    }

    export interface Port {
        port: number
        protocol?: Protocol
        name?: string
        appProtocol?: string
    }

    export interface Subset {
        addresses?: Address[]
        ports?: Port[]
    }

    export const Operator: ResourceOperator<Endpoints, CoreV1Api> = {
        apiVersion: "v1",
        kind: "Endpoints",
        apiType: CoreV1Api,
        async list(api: CoreV1Api, labelSelector: string) {
            const result = await api.listEndpointsForAllNamespaces(
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as Endpoints[];
        },
        async delete(api: CoreV1Api, object: Endpoints) {
            await api.deleteNamespacedEndpoints(
                object.metadata.name,
                object.metadata.namespace,
            )
        },
        async create(api: CoreV1Api, object: Endpoints) {
            await api.createNamespacedEndpoints(
                object.metadata.namespace,
                object,
            )
        },
        // async patch(api: CoreV1Api, object: Endpoints) {
        //     await api.patchNamespacedConfigMap(
        //         object.metadata.name,
        //         object.metadata.namespace,
        //         object,
        //     )
        // }
    }
}
