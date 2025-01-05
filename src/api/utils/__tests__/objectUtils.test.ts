import {removeObjectPropertyByKey} from '../objectUtils'

describe('removeObjectPropertyByKey', () => {
  test('Removes an existing key from the object', () => {
    const animal = {species: 'Lion', age: 5, habitat: 'Savannah'}
    const keyToRemove = 'age'
    const result = removeObjectPropertyByKey(animal, keyToRemove)
    expect(result).toEqual({species: 'Lion', habitat: 'Savannah'})
  })

  test('Returns the original object when the key does not exist', () => {
    const animal = {species: 'Elephant', age: 10}
    const keyToRemove = 'habitat'
    const result = removeObjectPropertyByKey(animal, keyToRemove)
    expect(result).toEqual({species: 'Elephant', age: 10})
  })

  test('Handles an empty object', () => {
    const animal = {}
    const keyToRemove = 'species'
    const result = removeObjectPropertyByKey(animal, keyToRemove)
    expect(result).toEqual({})
  })

  test('Does not remove a key if its value is falsey', () => {
    const animal = {species: 'Tiger', age: 0, habitat: null}
    const keyToRemove = 'age'
    const result = removeObjectPropertyByKey(animal, keyToRemove)
    expect(result).toEqual({species: 'Tiger', age: 0, habitat: null})
  })
})
