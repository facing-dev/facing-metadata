export function error(str: string): never {
    throw `facing-metadata: ${str}`
}