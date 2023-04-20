import { formatToMoment } from './index'
export default {
  text: (inputValue, field) => {
    return inputValue[field.key] ? inputValue[field.key] : ''
  },
  select: (inputValue, field) => {
    const type = field.options.length > 0 ? typeof field.options[0].value : 'string'
    if (!inputValue[field.key]) return undefined
    switch (type) {
      case 'number':
        return Number(inputValue[field.key])
      default:
        return String(inputValue[field.key])
    }
  },
  number: (inputValue, field) => {
    return inputValue[field.key]
  },
  switch: (inputValue, field) => {
    return inputValue[field.key]
  },
  radio: (inputValue, field) => {
    return inputValue[field.key]
  },
  datetime: (inputValue, field) => {
    return formatToMoment(inputValue[field.key])
  },
  datetimeRange: (inputValue, field) => {
    const value = inputValue[field.key]
    if (!value || !Array.isArray(value) || value.length < 2) {
      return value
    }
    return [formatToMoment(value[0]), formatToMoment(value[1])]
  },
  cascader: (inputValue, field) => {
    return inputValue[field.key]
  },
  multiple: (inputValue, field) => {
    const type = field.options.length > 0 ? typeof field.options[0].value : 'string'
    switch (type) {
      case 'number':
        return inputValue[field.key].map(o => Number(o))
      default:
        return inputValue[field.key].map(o => String(o))
    }
  },
  textarea: (inputValue, field) => {
    return inputValue[field.key]
  },
  timepicker: (inputValue, field) => {
    return inputValue[field.key]
  },
  file: (inputValue, field) => {
    return inputValue[field.key]
  },
  content: (inputValue, field) => {
    return inputValue[field.key]
  },
  point: (inputValue, field) => {
    return Array.isArray(inputValue[field.key]) ? inputValue[field.key] : []
  }
}
