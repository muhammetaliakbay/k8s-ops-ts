import { Pod } from "./pod";
import { KObject } from "./object";
import { AppsV1Api } from "@kubernetes/client-node";
import { ResourceOperator } from "../resource-operator";

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

    export const Operator: ResourceOperator<Deployment, AppsV1Api> = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        apiType: AppsV1Api,
        async list(api: AppsV1Api, labelSelector: string) {
            const result = await api.listDeploymentForAllNamespaces(
                undefined,
                undefined,
                undefined,
                labelSelector,
            );
            return result.body.items as Deployment[];
        },
        async delete(api: AppsV1Api, object: Deployment) {
            await api.deleteNamespacedDeployment(
                object.metadata.name,
                object.metadata.namespace,
            )
        },
        async create(api: AppsV1Api, object: Deployment) {
            await api.createNamespacedDeployment(
                object.metadata.namespace,
                object,
            )
        },
        // async patch(api: AppsV1Api, object: Deployment) {
        //     await api.patchNamespacedDeployment(
        //         object.metadata.name,
        //         object.metadata.namespace,
        //         object,
        //     )
        // }
    }
}
