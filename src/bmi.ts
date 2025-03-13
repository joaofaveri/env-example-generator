import { BMI, BMIClassification, Measurements } from './types'

export default function calculate(measurements: Measurements): BMI {
  // Input validation
  if (measurements.weight <= 0 || measurements.height <= 0) {
    throw new Error('Weight and height must be positive values')
  }
  // BMI calculation: weight (kg) / height² (m²)
  const bmi = measurements.weight / (measurements.height * measurements.height)
  // BMI classification into 7 levels
  let bmiClassification: BMIClassification
  if (bmi < 18.5) {
    bmiClassification = 'Underweight'
  } else if (bmi >= 18.5 && bmi < 25) {
    bmiClassification = 'Normal'
  } else if (bmi >= 25 && bmi < 30) {
    bmiClassification = 'Overweight'
  } else if (bmi >= 30 && bmi < 35) {
    bmiClassification = 'Obesity, Class I'
  } else if (bmi >= 35 && bmi < 40) {
    bmiClassification = 'Obesity, Class II'
  } else {
    bmiClassification = 'Obesity, Class III'
  }
  return {
    value: bmi,
    classification: bmiClassification
  }
}
