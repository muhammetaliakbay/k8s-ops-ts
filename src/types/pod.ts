import { KObject } from "./object";
import { Resource } from "./resource";

export namespace Pod {
    export interface Spec {
        containers: Container[]
        volumes?: Volume[]
        imagePullSecrets?: ImagePullSecretReference[]
    }

    export interface ImagePullSecretReference {
        name: string
    }

    export interface Template {
        metadata: KObject.Meta
        spec: Spec
    }

    export enum ImagePullPolicy {
        Always = "Always",
        IfNotPresent = "IfNotPresent",
        Never = "Never",
    }

    export interface Container {
        name: string
        image?: string
        imagePullPolicy?: ImagePullPolicy
        command?: string[]
        args?: string[]
        workingDir?: string
        ports?: Container.Port[]
        env?: Container.Env.Var[]
        envFrom?: Container.Env.FromSource[]
        resources?: Resource.Requirements
        volumeMounts?: Container.VolumeMount[]
    }
    
    export namespace Container {
        export interface VolumeMount {
            mountPath: string
            name: string
            mountPropagation?: string
            readOnly?: boolean
            subPath?: string
        }

        export namespace Env {
            export interface Var {
                name: string
                value?: string
                valueFrom?: Var.Source
            }

            export namespace Var {
                export interface Source {
                    configMapKeyRef?: Source.ConfigMapKeySelector
                    secretKeyRef?: Source.SecretKeySelector
                }

                export namespace Source {
                    export interface ConfigMapKeySelector {
                        key: string
                        name?: string
                        optional?: boolean
                    }
                    
                    export interface SecretKeySelector {
                        key: string
                        name?: string
                        optional?: boolean
                    }
                }
            }

            export interface FromSource {
                configMapKeyRef?: FromSource.ConfigMapEnvSource
                prefix?: string
                secretRef?: FromSource.SecretEnvSource
            }
            
            export namespace FromSource {
                export interface ConfigMapEnvSource {
                    name?: string
                    optional?: boolean
                }
                
                export interface SecretEnvSource {
                    name?: string
                    optional?: boolean
                }
            }
        }

        export interface Port {
            containerPort: number
            hostIP?: string
            hostPort?: number
            name?: string
            protocol?: Port.Protocol
        }

        export namespace Port {
            export enum Protocol {
                TCP = "TCP",
                UDP = "UDP",
                SCTP = "SCTP",
            }
        }
    }

    export interface Volume {
        name: string
        persistentVolumeClaim?: Volume.PersistentVolumeClaimVolumeSource
    }

    export namespace Volume {
        export interface PersistentVolumeClaimVolumeSource {
            claimName: string
            readOnly?: boolean
        }
    }
}
