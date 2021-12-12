import { KObject } from "..";

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
}
