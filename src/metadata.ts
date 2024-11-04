import { error } from './error'

export class Metadata<T extends {
    [index: string | number | symbol]: any
}> {
    symbol: symbol
    /**
     * Metadata.
     * @param symbol Optional. Signature for this metadata. It will be set as the key in the target.
     */
    constructor(symbol = Symbol('faple-metadata')) {
        this.symbol = symbol
    }

    /**
     * Create metadata in the target.
     * @param target Target.
     * @param data   Init metadata.
     */
    create(target: any, data: T) {
        if (Object.getOwnPropertyDescriptor(target, this.symbol)) {
            error('Target had metadata')
        }
        Object.defineProperty(target, this.symbol, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: data
        })
    }

    #travel(target: any, traveler: { (target: any, data: T): boolean }) {
        let t = target
        do {
            const data = this.getOwn(t)
            if (data !== undefined) {
                if (!traveler(target, data)) {
                    break
                }

            }
            t = Object.getPrototypeOf(t)
        } while (t !== null)
    }
    /**
     * Get own metadata.
     * @param target Target.
     * @returns Metadata data or undefined.
     */
    getOwn(target: any): T | undefined {
        const des = Object.getOwnPropertyDescriptor(target, this.symbol)
        if (!des) {
            return undefined
        }
        return des.value
    }
    /**
    * Get metadata in prototype chain.
    * @param target Target.
    * @returns Metadata data or undefined.
    */
    get(target: any): T | undefined {
        let data: T | undefined = undefined
        this.#travel(target, (target, _data) => {
            data = _data
            return false
        })
        return data
    }
    /**
     * Get metadata array in prototype chain.
     * @param target Target.
     * @returns Metadata array to acient.
     */
    getAll(target: any): T[] {
        let data: T[] = []
        this.#travel(target, (target, _data) => {
            data.push(_data)
            return true
        })
        return data
    }
    /**
     * Set value in the own mdatadata.
     * Implement by `obtainOwn`.
     * @param target Target.
     * @param key Key.
     * @param value value.
     */
    setValueOwn<K extends keyof T>(target: any, key: K, value: T[K]) {
        const _data = this.getOwn(target)
        if (!_data) {
            error('Target has not metadata')
        }
        _data[key] = value
    }
    /**
    * Set value in the recent mdatadata in prototype chain.
    * Implement by `obtain`.
    * @param target Target.
    * @param key Key.
    * @param value value.
    */
    setValue<K extends keyof T>(target: any, key: K, value: T[K]) {
        const _data = this.get(target)
        if (!_data) {
            error('Target has not metadata')
        }
        _data[key] = value
    }
    /**
     * Get value in the own metadata.
     * @param target Target.
     * @param key Key.
     * @returns 
     */
    getValueOwn<K extends keyof T>(target: any, key: K) {
        const data = this.getOwn(target)
        if (data === undefined) {
            error('Target has not metadata')
        }
        return data[key]
    }
    /**
    * Get value in the recent mdatadata WHICH HAS THE KEY in prototype chain.
    * @param target Target.
    * @param key Key.
    */
    getValue<K extends keyof T>(target: any, key: K) {
        let foundMetadata = false
        let value: T[K] | undefined = undefined
        this.#travel(target, (target, _data) => {
            foundMetadata = true
            if (!(key in _data) || _data[key] === undefined) {
                return true
            }
            value = _data[key]
            return false
        })
        if (!foundMetadata) {
            error('Target has not metadata')
        }
        return value as T[K]
    }
}
