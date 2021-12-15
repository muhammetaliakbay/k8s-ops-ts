import { CoreV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";
import { KObject } from "./object";

export interface Service extends KObject {
    apiVersion: "v1"
    kind: "Service"
    spec: Service.Spec
}

export namespace Service {
    export interface Port {
        port: number
        targetPort?: number | string
        protocol?: Port.Protocol
        name?: string
        nodePort?: number
    }

    export namespace Port {
        export enum Protocol {
            TCP = "TCP",
            UDP = "UDP",
            SCTP = "SCTP",
        }
    }
    
    export enum Type {
        ClusterIP = "ClusterIP",
        ExternalName = "ExternalName",
        LoadBalancer = "LoadBalancer",
        NodePort = "NodePort",
    }
    
    export interface Spec {
        selector?: KObject.Labels
        ports?: Port[]
        type?: Type
        clusterIp?: string
        clusterIPs?: string[]
        externalIPs?: string[]
        externalName?: string
        healthCheckNodePort?: number
        publishNotReadyAddresses?: boolean
    }

    export const Operator: ResourceOperator<Service, CoreV1Api> = {
        apiVersion: "v1",
        kind: "Service",
        apiType: CoreV1Api,
        async list(api: CoreV1Api, labelSelector: string) {
            const result = await api.listServiceForAllNamespaces(
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as Service[];
        },
        async delete(api: CoreV1Api, object: Service) {
            await api.deleteNamespacedService(
                object.metadata.name,
                object.metadata.namespace,
            )
        },
        async create(api: CoreV1Api, object: Service) {
            await api.createNamespacedService(
                object.metadata.namespace,
                object,
            )
        },
        async patch(api: CoreV1Api, object: Service) {
            await api.patchNamespacedService(
                object.metadata.name,
                object.metadata.namespace,
                object,
            )
        }
    }
}
