import { Pod } from "./pod";
import { KObject } from "./object";

export interface Deployment extends KObject {
    apiVersion: "apps/v1"
    kind: "Deployment"
    spec: Deployment.Spec
}

export namespace Deployment {
    export interface Spec {
        selector: KObject.LabelSelector
        template: Pod.Template
        replicas?: number
    }    
}
