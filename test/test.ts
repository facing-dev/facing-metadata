// const { Metadata } = require('../dist/index')
import { Metadata } from '../dist/index'

const symbol = Symbol('metadata');

const metadata = new Metadata(symbol);

(() => {
    const data = metadata.createData()
    class A { }
    class B extends A { }

    metadata.create(A, data)

    console.assert(metadata.get(A) === data, '1')
    console.assert(metadata.getOwn(B) === undefined, '2')
    console.assert(metadata.get(B) === data, '3')
    console.assert(metadata.getValue(A, 'kA') === undefined, '4')
    console.assert(metadata.getValue(B, 'kA') === undefined, '5')

    metadata.setValue(A, 'kA', 'vA')

    console.assert(metadata.getValue(A, 'kA') === 'vA', '6')
    console.assert(metadata.getValue(B, 'kA') === 'vA', '7')
    console.assert(metadata.getValueOwn(B, 'kA') === undefined, '8')

    metadata.setValue(B, 'kA', 'vA2')
    
    console.assert(metadata.getValue(A, 'kA') === 'vA2', '9')
    console.assert(metadata.getValueOwn(B, 'kA') === undefined, '10')

    metadata.setValueOwn(B, 'kB', 'vB')

    console.assert(metadata.getValue(A, 'kB') === undefined, '11')
    console.assert(metadata.getValueOwn(B, 'kB') === 'vB', '12')

})();



