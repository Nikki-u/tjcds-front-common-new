/* eslint-disable no-new */
import { isEmptyObj, isObject } from '../../../utils'
import transfer from '../../../utils/transfer'
import { Action, ActionContext, ValueChangeListener } from '../action/Action'
export default {
  props: {
    formValue: {
      // 表单数据 单项绑定赋值
      type: Object,
      default: function () {
        return {}
      }
    },
    fields: {
      // 表单项
      type: Array,
      default: function () {
        return []
      }
    },
    datetimeToTimeStamp: {
      // 是否把时间控件的返回值全部转为时间戳
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      submitFormValue: {},
      curFormValue: {},
      // 查询参数
      queryParams: {},
      formActions: []
    }
  },
  watch: {
    formValue: {
      handler (val) {
        this.reloadFormValue(val)
      },
      deep: true,
      immediate: true
    },
    fields: {
      handler () {
        this.createActions()
      },
      immediate: true
    }
  },
  methods: {
    handleParams (obj) {
      // 判断必须为obj
      if (!(Object.prototype.toString.call(obj) === '[object Object]')) {
        return {}
      }
      const tempObj = {}
      // eslint-disable-next-line prefer-const
      for (let [key, value] of Object.entries(obj)) {
        if (isEmptyObj(value)) continue
        if (Array.isArray(value) && value.length <= 0) continue
        if (Object.prototype.toString.call(value) === '[object Function]') continue
        if (this.datetimeToTimeStamp) {
          // 若是为true,则转为时间戳
          if (Object.prototype.toString.call(value) === '[object Object]' && value._isAMomentObject) {
            // 判断moment
            value = value.valueOf()
          }
          if (Array.isArray(value) && value[0]._isAMomentObject && value[1]._isAMomentObject) {
            // 判断moment
            value = value.map(o => (o.valueOf()))
          }
        }
        // 若是为字符串则清除两边空格
        if (value && typeof value === 'string') {
          value = value.trim()
        }
        if (!isEmptyObj(value) && value !== '') {
          tempObj[key] = value
        }
      }
      return tempObj
    },
    reloadFormValue (formValue) {
      this.curFormValue = Object.assign({}, formValue)
      this.submitFormValue = Object.assign({}, formValue)
      // 重置表单项的值
      this.$nextTick(() => {
        if (isEmptyObj(formValue)) {
          this.form.resetFields()
        } else {
          const formFieldsValue = this.form.getFieldsValue()
          for (const key in formFieldsValue) {
            formFieldsValue[key] = this.transfer(formValue, this.fields.find(o => o.key === key), key)
          }
          this.form.setFieldsValue(formFieldsValue)
        }
      })
    },
    transfer (inputValue, field, key) {
      if (!field) {
        return inputValue[key] || ''
      }
      const transferFun = transfer[field.type] || transfer.text
      return transferFun(inputValue, field)
    },
    submit () {
      // 触发表单提交，也就是搜索按钮
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.queryParams = this.handleParams(values)
          this.$emit('on-value-change', this.queryParams)
          this.$emit('submit', this.queryParams)
          // 兼容处理
          this.$emit('on-submit', this.queryParams)
          this.submitFormValue = Object.assign({}, values)
        }
      })
    },
    reset () {
      // 重置整个表单
      this.form.resetFields()
      this.$emit('reset')
      this.$emit('on-reset')
    },
    triggerActions () {
      this.formActions.forEach(action => {
        action.trigger.apply(action, arguments)
      })
    },
    createActions () {
      this.formActions = this.fields
        .filter(field => {
          return field.action && isObject(field.action)
        })
        .map(field => {
          return new Action(
            field.action,
            new ActionContext(this, {
              field: field
            })
          )
        })
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      onValuesChange: (props, values) => {
        this.triggerActions(ValueChangeListener.getName(), props, values)
        const fields = {}
        this.fields.forEach(o => {
          fields[o.key] = this.form.getFieldValue(o.key)
        })
        this.queryParams = this.handleParams(fields)
        const field = this.handleParams(values)
        // 判断如果当前这个新增的值在queryParams中不存在，则删除这个key，防止值错误，这里的fields是值变更前的
        for (const key of Object.keys(values)) {
          if (isEmptyObj(values[key])) {
            delete this.queryParams[key]
          }
        }
        this.curFormValue = Object.assign({}, this.queryParams)
        Object.assign(this.queryParams, field)
        this.$emit('on-value-change', this.queryParams)
        this.fields.forEach(o => {
          // 判断是否为select，判断是否有配置值变化的监听，判断当前的值在queryParams中是否存在
          if (o.type === 'select' && o.action) {
            const FieldPropertyArr = Object.entries(field)
            if (FieldPropertyArr instanceof Array) {
              if (FieldPropertyArr.length === 1) {
                if (FieldPropertyArr[0][0]) {
                  if (FieldPropertyArr[0][0] === o.key && field[o.key] === this.queryParams[o.key]) {
                    this.$emit('on-res-select-value-change', this.queryParams)
                  }
                }
              }
            }
          }
        })
      }
    })
  }
}
