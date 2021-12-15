export namespace Resource {
    export type Quantity = `${number}${""|"m"|"k"|"M"|"G"|"T"|"P"|"E"|"Ki"|"Mi"|"Gi"|"Ti"|"Pi"|"Ei"}`

    export enum Type {
        CPU = "cpu",
        Memory = "memory",
        Storage = "storage",
    }

    export type Quantities = Record<string, Quantity>

    export interface Requirements {
        limits?: Quantities
        requests?: Quantities
    }
}
