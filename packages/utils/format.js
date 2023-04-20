import { formatDate } from './index'
export default {
  text: (formValue, field) => {
    return formValue[field.key]
  },
  select: (formValue, field) => {
    const option = field.options.find(option => (option.value === formValue[field.key]))
    return option ? option.label : ''
  },
  switch: (formValue, field) => {
    return formValue[field.key]
  },
  number: (formValue, field) => {
    return formValue[field.key]
  },
  radio: (formValue, field) => {
    const option = field.options.find(option => (option.value === formValue[field.key]))
    return option ? option.label : ''
  },
  datetime: (formValue, field) => {
    return formatDate(formValue[field.key], field.format || 'YYYY-MM-DD HH:mm:ss')
  },
  datetimeRange: (formValue, field) => {
    const value = formValue[field.key]
    if (!value || !Array.isArray(value) || value.length < 2) {
      return value
    }
    return `${formatDate(value[0], field.format || 'YYYY-MM-DD HH:mm:ss')} - ${formatDate(value[1], field.format || 'YYYY-MM-DD HH:mm:ss')}`
  },
  cascader: (formValue, field) => {
    return formValue[field.key]
  },
  multiple: (formValue, field) => {
    const value = formValue[field.key]
    if (!value || !Array.isArray(value)) {
      return value
    }
    return value.map(o => {
      const option = field.options.find(option => (option.value === o))
      return option ? option.label : o
    }).join(',')
  },
  textarea: (formValue, field) => {
    return formValue[field.key]
  },
  timepicker: (formValue, field) => {
    return formValue[field.key]
  },
  file: (formValue, field) => {
    return formValue[field.key]
  }
}
