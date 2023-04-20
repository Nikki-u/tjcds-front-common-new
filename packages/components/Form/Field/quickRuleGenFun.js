/**
 * 自动生成表单的必填规则
 * @param String field 字段信息
 */
const genRequiredRule = function (field) {
  return { required: true, message: `${field.title}必须填写` }
}

/**
 * 自动生成表单的最大字符限制规则
 * @param String field 字段信息
 * @param Number max 最大字符限制
 */
const genMaxLimitRule = function (field, max) {
  if (field.type === 'number') {
    return { type: 'number', max: parseInt(Math.pow(max, 6)), message: `${field.title}不能超过${max}字符` }
  } else if (field.type === 'multiple') {
    return { type: 'array', max: parseInt(max), message: `${field.title}最多只能选中${max}项` }
  } else {
    return { max: parseInt(max), message: `${field.title}不能超过${max}字符` }
  }
}

/**
 * 自动生成表单的最小字符限制规则
 * @param String field 字段信息
 * @param Number min 最小字符限制
 */
const genMinLimitRule = function (field, min) {
  if (field.type === 'number') {
    return { type: 'number', min: parseInt(Math.pow(min, 10)), message: `${field.title}不能少于${min}字符` }
  } else if (field.type === 'multiple') {
    return { type: 'array', min: parseInt(min), message: `${field.title}最少要选中${min}项` }
  } else {
    return { min: parseInt(min), message: `${field.title}不能少于${min}字符` }
  }
}

/**
 * 自动生成表单的电话好吗规则
 * @param String field 字段信息
 */
const genPhoneRule = function (field) {
  return {
    message: '不是一个有效的手机/固定号码',
    validator: (rule, value) => {
      if (!value) {
        return true
      }
      const phoneRegex = /^[1]([3-9])[0-9]{9}$/
      const fixedPhoneRegex = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
      return phoneRegex.test(value) || fixedPhoneRegex.test(value)
    }
  }
}

/**
 * 自动生成表单的正则校验规则
 * @param String field 字段信息
 * @param Pattern pattern 正则表达式
 */
// 替代eval（）
const evil = function (fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
const genPatternRule = function (field, pattern) {
  return { pattern: evil(pattern), message: `${field.title}不合法` }
}
export default {
  required: genRequiredRule,
  max: genMaxLimitRule,
  min: genMinLimitRule,
  phone: genPhoneRule,
  pattern: genPatternRule
}
