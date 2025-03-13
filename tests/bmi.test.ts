import calculate from '../src/bmi'
import { Measurements } from '../src/types'

describe('Calculate BMI', () => {
  test('should calculate BMI correctly and classify as Underweight', () => {
    const measurements: Measurements = { weight: 50, height: 1.8 }
    const result = calculate(measurements)
    expect(result.value).toBeCloseTo(15.43)
    expect(result.classification).toBe('Underweight')
  })

  test('should calculate BMI correctly and classify as Normal', () => {
    const measurements: Measurements = { weight: 70, height: 1.75 }
    const result = calculate(measurements)
    expect(result.value).toBeCloseTo(22.86)
    expect(result.classification).toBe('Normal')
  })

  test('should calculate BMI correctly and classify as Overweight', () => {
    const measurements: Measurements = { weight: 80, height: 1.7 }
    const result = calculate(measurements)
    expect(result.value).toBeCloseTo(27.68)
    expect(result.classification).toBe('Overweight')
  })

  test('should calculate BMI correctly and classify as Obesity, Class I', () => {
    const measurements: Measurements = { weight: 100, height: 1.75 }
    const result = calculate(measurements)
    expect(result.value).toBeCloseTo(32.65)
    expect(result.classification).toBe('Obesity, Class I')
  })

  test('should calculate BMI correctly and classify as Obesity, Class II', () => {
    const measurements: Measurements = { weight: 120, height: 1.75 }
    const result = calculate(measurements)
    expect(result.value).toBeCloseTo(39.18)
    expect(result.classification).toBe('Obesity, Class II')
  })

  test('should calculate BMI correctly and classify as Obesity, Class III', () => {
    const measurements: Measurements = { weight: 140, height: 1.75 }
    const result = calculate(measurements)
    expect(result.value).toBeCloseTo(45.71)
    expect(result.classification).toBe('Obesity, Class III')
  })

  test('should throw an error for negative weight', () => {
    const measurements: Measurements = { weight: -10, height: 1.75 }
    expect(() => calculate(measurements)).toThrow(
      'Weight and height must be positive values'
    )
  })

  test('should throw an error for negative height', () => {
    const measurements: Measurements = { weight: 70, height: -1.75 }
    expect(() => calculate(measurements)).toThrow(
      'Weight and height must be positive values'
    )
  })

  test('should throw an error for zero weight', () => {
    const measurements: Measurements = { weight: 0, height: 1.75 }
    expect(() => calculate(measurements)).toThrow(
      'Weight and height must be positive values'
    )
  })

  test('should throw an error for zero height', () => {
    const measurements: Measurements = { weight: 70, height: 0 }
    expect(() => calculate(measurements)).toThrow(
      'Weight and height must be positive values'
    )
  })
})
