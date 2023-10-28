import { error } from './error'
export class Metadata<T extends {
    [index: string | number | symbol]: any
}>{
    symbol: symbol
    constructor(symbol = Symbol('faple-metadata')) {
        this.symbol = symbol
    }
    #travel(target: any, traveler: { (target: any, data: Partial<T>): boolean }) {
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
    createData(): Partial<T> {
        return Object.create(null)
    }
    create(target: any, data?: Partial<T>) {
        if (Object.getOwnPropertyDescriptor(target, this.symbol)) {
            error('Target had metadata')
        }
        Object.defineProperty(target, this.symbol, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: data ?? {}
        })
    }

    getOwn(target: any): Partial<T> | undefined {
        const des = Object.getOwnPropertyDescriptor(target, this.symbol)
        if (!des) {
            return undefined
        }
        return des.value
    }
    get(target: any): Partial<T> | undefined {
        let data: Partial<T> | undefined = undefined
        this.#travel(target, (target, _data) => {
            data = _data
            return false
        })
        return data
    }
    obtainOwn(target: any, data?: Partial<T>): Partial<T> {
        const _data = this.getOwn(target)
        if (_data !== undefined) {
            return _data
        }
        const __data = data ?? this.createData()
        this.create(target, __data)
        return __data
    }
    obtain(target: any, data?: Partial<T>): Partial<T> {
        const _data = this.get(target)
        
        if (_data !== undefined) {
            return _data
        }
        const __data = data ?? this.createData()
        this.create(target, __data)
        return __data
    }
    setValueOwn<K extends keyof T>(target: any, key: K, value: T[K]) {
        const data = this.obtainOwn(target)
        data[key] = value
    }
    setValue<K extends keyof T>(target: any, key: K, value: T[K]) {
        const data = this.obtain(target)
    
        data[key] = value
    }
    getValueOwn<K extends keyof T>(target: any, key: K) {
        const data = this.getOwn(target)
        if(data===undefined){
            return undefined
        }
        return data[key]
    }
    getValue<K extends keyof T>(target: any, key: K) {
        let value: any | undefined = undefined
        this.#travel(target, (target, _data) => {
            if (!(key in _data)) {
                return true
            }
            value = _data[key]
            return false
        })
        return value
    }
}
