export interface KObject {
    apiVersion: string
    kind: string
    metadata: KObject.Meta
}

export namespace KObject {
    export type Labels = Record<string, string>
    export type Annotations = Record<string, string>

    export interface LabelSelector {
        matchLabels?: Labels
    }

    export interface Meta {
        name?: string
        namespace?: string
        labels?: Labels
        annotations?: Annotations
    }

    export type ApiVersion<T extends KObject> = T extends {apiVersion: infer V} ? V : never
    export type Kind<T extends KObject> = T extends {kind: infer K} ? K : never
}
