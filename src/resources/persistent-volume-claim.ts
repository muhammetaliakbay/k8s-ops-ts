import { CoreV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";
import { KObject } from "./object";
import { Resource } from "./resource";

export interface PersistentVolumeClaim extends KObject {
    apiVersion: "v1"
    kind: "PersistentVolumeClaim"
    spec: PersistentVolumeClaim.Spec
}

export namespace PersistentVolumeClaim {
    export interface Spec {
        accessModes?: AccessMode[]
        selector?: KObject.LabelSelector
        resources?: Resource.Requirements
        volumeName?: string
        storageClassName?: string
        volumeMode?: VolumeMode
    }

    export enum AccessMode {
        ReadWriteOnce = "ReadWriteOnce",
        ReadOnlyMany = "ReadOnlyMany",
        ReadWriteMany = "ReadWriteMany",
        ReadWriteOncePod = "ReadWriteOncePod",
    }
    
    export enum VolumeMode {
        Filesystem = "Filesystem",
        Block = "Block",
    }

    export const Operator: ResourceOperator<PersistentVolumeClaim, CoreV1Api> = {
        apiVersion: "v1",
        kind: "PersistentVolumeClaim",
        apiType: CoreV1Api,
        async list(api: CoreV1Api, labelSelector: string) {
            const result = await api.listPersistentVolumeClaimForAllNamespaces(
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as PersistentVolumeClaim[];
        },
        async delete(api: CoreV1Api, object: PersistentVolumeClaim) {
            await api.deleteNamespacedPersistentVolumeClaim(
                object.metadata.name,
                object.metadata.namespace,
            )
        },
        async create(api: CoreV1Api, object: PersistentVolumeClaim) {
            await api.createNamespacedPersistentVolumeClaim(
                object.metadata.namespace,
                object,
            )
        },
        async patch(api: CoreV1Api, object: PersistentVolumeClaim) {
            await api.patchNamespacedPersistentVolumeClaim(
                object.metadata.name,
                object.metadata.namespace,
                object,
            )
        }
    }
}
