export default {
  computed: {
    hasFormModal () {
      // 是否展示表单列
      return this.columns.some(col => { return col.insert || col.edit })
    },
    previewFields () {
      return this.columns
        .filter(col => col.preview)
        .map(col => {
          return Object.assign({}, col)
        })
    },
    formFields () {
      // 表单项数据
      const defaultFormType = 'text'
      return this.columns
        .filter(col => {
          return (this.formModalAction === 'insert' && col.insert) ||
          (this.formModalAction === 'edit' && col.edit)
        })
        .map(col => {
          const fieldOptions = {}
          Object.keys(col).filter(k => (k.startsWith('form') && !k.endsWith('slot')))
            .map(k => ({
              origin: k,
              target: k.replace(/^form/, '').replace(/^\S/, s => s.toLowerCase())
            }))
            .filter(kobj => kobj.target !== '')
            .forEach(kobj => (fieldOptions[kobj.target] = col[kobj.origin]))
          return Object.assign({}, fieldOptions, {
            formSlot: col.formSlot,
            action: col.formAction || col.action,
            title: col.title,
            options: col.options,
            quickRule: col.quickRule,
            rules: col.rules,
            type: col.formType || col.type || defaultFormType,
            key: col.dataIndex,
            showTime: col.showTime,
            default: col.default,
            allowClear: col.allowClear,
            disabled: col.disabled,
            disabledDate: col.disabledDate,
            defaultPickerValue: col.defaultPickerValue,
            max: col.max
          })
        })
    },
    slotFormFields () {
      // 挂载的子项
      return this.formFields.filter(item => (item.formSlot))
    }
  },
  data () {
    return {
      formValue: {},
      formModalVisible: false,
      formModalAction: null,
      formLoading: false,
      previewModalVisible: false,
      previewValue: {}
    }
  },
  methods: {
    handleFormSubmit (formParams) {
      // 处理筛选提交事件 向上提交
      this.formLoading = true
      const finish = (unClose = false) => {
        this.formLoading = false
        this.formModalVisible = !!unClose
      }
      this.$emit('on-form-submit', this.formModalAction, formParams, finish)
    },
    openInsertFormModal (params) {
      // 创建新增表单
      this.formModalVisible = true
      this.formModalAction = 'insert'
      this.formValue = Object.assign({}, params)
    },
    openEditFormModal (params) {
      // 创建编辑表单
      this.formModalVisible = true
      this.formModalAction = 'edit'
      this.formValue = Object.assign({}, params)
    },
    openPreviewModal (params) {
      this.previewModalVisible = true
      this.previewValue = Object.assign({}, params)
    }
  },
  filters: {
    formModalActionFilter (value, title) {
      return value ? { insert: `新增${title}`, edit: `编辑${title}` }[value] : ''
    }
  }
}
