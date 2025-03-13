export type Measurements = {
  height: number
  weight: number
  age?: number
  sex?: 'M' | 'F'
}

export type BMI = {
  value: number
  classification: BMIClassification
}

export type BMIClassification =
  | 'Underweight'
  | 'Normal'
  | 'Overweight'
  | 'Obesity, Class I'
  | 'Obesity, Class II'
  | 'Obesity, Class III'
