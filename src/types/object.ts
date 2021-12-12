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
}
