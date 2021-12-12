import { KObject } from "./object";

export interface Service extends KObject {
    apiVersion: "v1"
    kind: "Service"
    spec: Service.Spec
}

export namespace Service {
    export interface Port {
        port: number
        targetPort?: number | string
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
}
