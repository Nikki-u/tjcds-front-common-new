import Moment from 'moment'
const hasProp = function (instance, prop) {
  const $options = instance.$options || {}
  const propsData = $options.propsData || {}
  return prop in propsData
}

const isEmptyObj = function (obj) {
  return obj === undefined || obj === null || (isObject(obj) && Object.keys(obj).length === 0)
}

const isObject = function (obj) {
  var type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

const isNumber = function (input) {
  var re = /^[0-9]+.?[0-9]*/
  return re.test(input)
}

const formatDate = function (value, format) {
  if (value === null || value === undefined) {
    return ''
  }
  format = format || 'YYYY-MM-DD HH:mm:ss'
  if (Object.prototype.toString.call(value) === '[object String]') {
    if (value.indexOf('+') > -1) {
    // utc
    return Moment(value).utcOffset(480).format(format)
    }
    return value
  }
  if (!isNaN(value)) {
    if (value.toString().length === 10) {
      return Moment.unix(value).format(format)
    }
    if (value.toString().length === 13) {
      return Moment(value).format(format)
    }
  }
  if (value instanceof Date) {
    return Moment(value).format(format)
  }
  if (value instanceof Moment) {
    return value.format(format)
  }
  return Moment(value).format(format)
}

const formatToMoment = function (value) {
  if (value === null || value === undefined) {
    return null
  }
  if (value instanceof Moment) {
    return value
  }
  if (value instanceof Date) {
    return Moment(value)
  }
  if (!isNaN(value)) {
    if (value.toString().length === 10) {
      return Moment.unix(value)
    }
    if (value.toString().length === 13) {
      return Moment(value)
    }
  }
  if (Object.prototype.toString.call(value) === '[object String]') {
    if (value.indexOf('+') > -1) {
      // utc 直接使用 Moment.utc(value) 会出现utc格式写入时日期change事件多一天的bug
      return Moment.unix(Moment.utc(value).unix())
    }
  }
  return Moment(value)
}

const formatObj = function (value, format) {
  const objKeys = format.split('.')
  let formatText = Object.assign({}, value)
  for (const i in objKeys) {
    formatText = formatText[objKeys[i]]
    if (!formatText) return ''
  }
  return formatText
}

export {
  hasProp,
  isObject,
  isEmptyObj,
  isNumber,
  formatDate,
  formatToMoment,
  formatObj
}
