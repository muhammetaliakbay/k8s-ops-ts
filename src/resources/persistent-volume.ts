import { CoreV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";
import { KObject } from "./object";
import { Resource } from "./resource";

export interface PersistentVolume extends KObject {
    apiVersion: "v1"
    kind: "PersistentVolume"
    spec: PersistentVolume.Spec
}

export namespace PersistentVolume {
    export interface Spec {
        accessModes?: AccessMode[]
        capacity?: Resource.Quantities
        mountOptions?: string[]
        persistentVolumeReclaimPolicy?: ReclaimPolicy,
        storageClassName?: string
        volumeMode?: VolumeMode
        hostPath?: HostPath
        local?: Local
    }

    export interface Local {
        path: string
        fsType?: string
    }

    export interface HostPath {
        path: string
        type?: HostPath.Type
    }

    export namespace HostPath {
        export enum Type {
            Default = "",
            DirectoryOrCreate = "DirectoryOrCreate",
            Directory = "Directory",
            FileOrCreate = "FileOrCreate",
            File = "File",
            Socket = "Socket",
            CharDevice = "CharDevice",
            BlockDevice = "BlockDevice",
        }
    }

    export enum ReclaimPolicy {
        Delete = "Delete",
        Recycle = "Recycle",
        Retain = "Retain",
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

    export const Operator: ResourceOperator<PersistentVolume, CoreV1Api> = {
        apiVersion: "v1",
        kind: "PersistentVolume",
        apiType: CoreV1Api,
        async list(api: CoreV1Api, labelSelector: string) {
            const result = await api.listPersistentVolume(
                undefined,
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as PersistentVolume[];
        },
        async delete(api: CoreV1Api, object: PersistentVolume) {
            await api.deletePersistentVolume(
                object.metadata.name,
            )
        },
        async create(api: CoreV1Api, object: PersistentVolume) {
            await api.createPersistentVolume(
                object,
            )
        },
        // async patch(api: CoreV1Api, object: PersistentVolume) {
        //     await api.patchPersistentVolume(
        //         object.metadata.name,
        //         object,
        //     )
        // }
    }
}
