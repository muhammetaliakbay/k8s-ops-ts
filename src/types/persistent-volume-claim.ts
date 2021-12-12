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
}
