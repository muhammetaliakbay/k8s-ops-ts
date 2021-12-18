import { ApiType, KubeConfig, KubernetesObjectApi } from "@kubernetes/client-node"
import { ApiConstructor, ResourceOperator } from "./resource-operator"
import { KObject } from "./resources"

const kc = new KubeConfig()
kc.loadFromDefault()

function findResource(resources: KObject[], subject: KObject) {
    for (const resource of resources) {
        if (
            resource.apiVersion === subject.apiVersion
            && resource.kind === subject.kind
            && (resource.metadata?.namespace ?? "default") === (subject.metadata?.namespace ?? "default")
            && (resource.metadata.name != undefined && resource.metadata.name === subject.metadata.name)
        ) {
            return resource
        }
    }
    return undefined
}

function labelSelector(id: string) {
    return `id=${id}`
}

function override(resource: KObject, id: string): KObject {
    return {
        ...resource,
        metadata: {
            ...resource.metadata,
            namespace: resource.metadata?.namespace ?? "default",
            labels: {
                ...resource.metadata?.labels,
                id,
            },
        },
    }
}

export class Manager {
    private constructor(
        readonly kubeConfig: KubeConfig,
        readonly operators: ResourceOperator<KObject, ApiType>[],
    ) {
    }

    private objectApi = this.kubeConfig.makeApiClient(KubernetesObjectApi)

    private apis = new Map<ApiConstructor<ApiType>, ApiType>()
    private useApi<A extends ApiType>(api: ApiConstructor<A>): A {
        let instance = this.apis.get(api)
        if (instance == null) {
            instance = this.kubeConfig.makeApiClient(api)
            this.apis.set(api, instance)
        }
        return instance as A
    }

    static fromKubeConfig(
        kubeConfig: KubeConfig,
        operators: ResourceOperator<KObject, ApiType>[],
    ) {
        return new Manager(kubeConfig, operators)
    }

    private findOperator<O extends KObject>(object: O): ResourceOperator<O, ApiType> {
        const operator = this.operators.find(
            operator => operator.apiVersion === object.apiVersion && operator.kind === object.kind
        )
        if (operator == null) {
            throw new Error(`No operator is provided for the object kind ${object.apiVersion} / ${object.kind}`)
        }
        return operator as ResourceOperator<O, ApiType>
    }

    private async list<O extends KObject>(id: string, operator: ResourceOperator<O, ApiType>) {
        return (await operator.list(this.useApi(operator.apiType), labelSelector(id))).map(
            resource => ({
                ...resource,
                apiVersion: operator.apiVersion,
                kind: operator.kind,
            })
        )
    }

    private async delete<O extends KObject>(object: O, operator?: ResourceOperator<O, ApiType>) {
        operator ??= this.findOperator(object)
        return operator.delete(this.useApi(operator.apiType), object)
    }

    private async create<O extends KObject>(object: O, operator?: ResourceOperator<O, ApiType>) {
        operator ??= this.findOperator(object)
        return operator.create(this.useApi(operator.apiType), object)
    }

    private async patch<O extends KObject>(object: O, operator?: ResourceOperator<O, ApiType>) {
        operator ??= this.findOperator(object)
        if ('patch' in operator) {
            return operator.patch(this.useApi(operator.apiType), object)
        } else {
            return this.objectApi.patch(object)
        }
    }
    
    private async listResources(id: string) {
        const objects: KObject[] = []
        for (const operator of this.operators) {
            const list = await this.list(id, operator)
            objects.push(...list)
        }
        return objects
    }

    async deleteResources(id: string) {
        const objects = await this.listResources(id)
        for (const object of objects) {
            await this.delete(object)
        }
    }

    async applyResources(id: string, resources: KObject[]) {
        const existingResources = await this.listResources(id)
        const resourcesToCreate = resources.filter(
            resource => findResource(existingResources, resource) == null,
        )
        const resourcesToPatch = resources.filter(
            resource => findResource(existingResources, resource) != null,
        )
        const resourcesToDelete = existingResources.filter(
            resource => findResource(resources, resource) == null,
        )
        for (const resourceToPatch of resourcesToPatch) {
            await this.patch(override(resourceToPatch, id))
        }
        for (const resourceToCreate of resourcesToCreate) {
            await this.create(override(resourceToCreate, id))
        }
        for (const resourceToDelete of resourcesToDelete) {
            await this.delete(resourceToDelete)
        }
    }
}
