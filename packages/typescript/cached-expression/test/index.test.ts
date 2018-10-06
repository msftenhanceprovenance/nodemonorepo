import Calculator from '../index'

const keys = [0, 1, false, true, {}, { hello: 'world' }, [], ['foo', 'bar']]

it('calls every function once', () => {
  const count = Array<any>()
  const fn = (x: any) => {
    count.push(x)
    return { x }
  }
  const { calculate } = new Calculator(fn)

  for (const x of keys) {
    Array(5).fill(0).forEach(() => calculate(x))
  }

  expect(count.length).toBe(keys.length)
})

it('caches results', () => {
  const { calculate } = new Calculator(Math.random)
  const getArray = () => keys.map(calculate)
  const first = getArray()
  const second = getArray()
  const third = getArray()
  const fourth = getArray()
  expect(first).toEqual(second)
  expect(first).toEqual(third)
  expect(first).toEqual(fourth)
})

it('produces correct results', () => {
  const fn = (x: any) => ({ x })
  const { calculate } = new Calculator(fn)
  const expected = keys.map(fn)
  const received = keys.map(calculate)
  expect(received).toEqual(expected)
})
