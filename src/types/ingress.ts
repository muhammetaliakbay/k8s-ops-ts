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
}
