import { CoreV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";
import { KObject } from "./object";

export interface Secret extends KObject {
    apiVersion: "v1"
    kind: "Secret"
    stringData?: Secret.StringData
    immutable?: boolean
    type?: string
}

export namespace Secret {
    export type StringData = Record<string, string>

    export enum KnownType {
        Opaque = "Opaque",
        ServiceAccountToken = "kubernetes.io/service-account-token",
        DokerCfg = "kubernetes.io/dockercfg",
        DokerConfigJson = "kubernetes.io/dockerconfigjson",
        BasicAuth = "kubernetes.io/basic-auth",
        SSHAuth = "kubernetes.io/ssh-auth",
        TLS = "kubernetes.io/tls",
        BootstrapToken = "bootstrap.kubernetes.io/token",
    }

    export const Operator: ResourceOperator<Secret, CoreV1Api> = {
        apiVersion: "v1",
        kind: "Secret",
        apiType: CoreV1Api,
        async list(api: CoreV1Api, labelSelector: string) {
            const result = await api.listSecretForAllNamespaces(
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as Secret[];
        },
        async delete(api: CoreV1Api, object: Secret) {
            await api.deleteNamespacedSecret(
                object.metadata.name,
                object.metadata.namespace,
            )
        },
        async create(api: CoreV1Api, object: Secret) {
            await api.createNamespacedSecret(
                object.metadata.namespace,
                object,
            )
        },
        // async patch(api: CoreV1Api, object: Secret) {
        //     await api.patchNamespacedSecret(
        //         object.metadata.name,
        //         object.metadata.namespace,
        //         object,
        //     )
        // }
    }
}
