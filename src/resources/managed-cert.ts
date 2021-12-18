import { CustomObjectsApi, NetworkingV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";
import { KObject } from "./object";

export interface ManagedCertificate extends KObject {
    apiVersion: "networking.gke.io/v1"
    kind: "ManagedCertificate"
    spec: ManagedCertificate.Spec
}

export namespace ManagedCertificate {
    export interface Spec {
        domains?: string[]
    }

    export const Operator: ResourceOperator<ManagedCertificate, CustomObjectsApi> = {
        apiVersion: "networking.gke.io/v1",
        kind: "ManagedCertificate",
        apiType: CustomObjectsApi,
        async list(api: CustomObjectsApi, labelSelector: string) {
            const result = await api.listClusterCustomObject(
                "networking.gke.io",
                "v1",
                "managedcertificates",
                undefined,
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return (result.body as any).items as ManagedCertificate[];
        },
        async delete(api: CustomObjectsApi, object: ManagedCertificate) {
            await api.deleteNamespacedCustomObject(
                "networking.gke.io",
                "v1",
                object.metadata.namespace,
                "managedcertificates",
                object.metadata.name,
            )
        },
        async create(api: CustomObjectsApi, object: ManagedCertificate) {
            await api.createNamespacedCustomObject(
                "networking.gke.io",
                "v1",
                object.metadata.namespace,
                "managedcertificates",
                object,
            )
        },
        async patch(api: CustomObjectsApi, object: ManagedCertificate) {
            await api.patchNamespacedCustomObject(
                "networking.gke.io",
                "v1",
                object.metadata.namespace,
                "managedcertificates",
                object.metadata.name,
                object,
                undefined,
                undefined,
                undefined,
                {
                    headers: {
                        "content-type": "application/merge-patch+json",
                    },
                },
            )
        }
    }
}
