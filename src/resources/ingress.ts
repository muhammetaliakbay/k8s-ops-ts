import { NetworkingV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";
import { KObject } from "./object";

export interface Ingress extends KObject {
    apiVersion: "networking.k8s.io/v1"
    kind: "Ingress"
    spec: Ingress.Spec
}

export namespace Ingress {
    export interface Spec {
        defaultBackend?: Backend
        ingressClassName?: string
        rules?: Rule[]
    }
    
    export interface Backend {
        service?: Backend.Service
    }

    export namespace Backend {
        export interface Service {
            name: string
            port?: Service.Port
        }

        export namespace Service {
            export interface Port {
                name?: string
                number?: number
            }
        }
    }
    
    export interface Rule {
        host?: string
        http?: HTTPRule
    }
    
    export interface HTTPRule {
        paths: HTTPRule.Path[]
    }

    export namespace HTTPRule {
        export interface Path {
            backend: Backend
            pathType: PathType
            path?: string
        }

        export enum PathType {
            Exact = 'Exact',
            Prefix = 'Prefix',
            ImplementationSpecific = 'ImplementationSpecific',
        }
    }

    export const Operator: ResourceOperator<Ingress, NetworkingV1Api> = {
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        apiType: NetworkingV1Api,
        async list(api: NetworkingV1Api, labelSelector: string) {
            const result = await api.listIngressForAllNamespaces(
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as Ingress[];
        },
        async delete(api: NetworkingV1Api, object: Ingress) {
            await api.deleteNamespacedIngress(
                object.metadata.name,
                object.metadata.namespace,
            )
        },
        async create(api: NetworkingV1Api, object: Ingress) {
            await api.createNamespacedIngress(
                object.metadata.namespace,
                object,
            )
        },
        async patch(api: NetworkingV1Api, object: Ingress) {
            await api.patchNamespacedIngress(
                object.metadata.name,
                object.metadata.namespace,
                object,
            )
        }
    }
}
