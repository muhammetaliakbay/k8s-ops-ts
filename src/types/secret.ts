import { KObject } from "./object";

export type SecretStringData = Record<string, string>

export enum KnownSecretType {
    Opaque = "Opaque",
    ServiceAccountToken = "kubernetes.io/service-account-token",
    DokerCfg = "kubernetes.io/dockercfg",
    DokerConfigJson = "kubernetes.io/dockerconfigjson",
    BasicAuth = "kubernetes.io/basic-auth",
    SSHAuth = "kubernetes.io/ssh-auth",
    TLS = "kubernetes.io/tls",
    BootstrapToken = "bootstrap.kubernetes.io/token",
}

export interface Secret extends KObject {
    apiVersion: "v1"
    kind: "Secret"
    stringData?: SecretStringData
    immutable?: boolean
    type?: string
}
