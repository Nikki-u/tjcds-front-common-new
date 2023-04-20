export default {
  computed: {
    hasFormFilter () {
      // 是否展示筛选
      return this.columns.some(col => { return col.filter })
    },
    filterFields () {
      // 筛选项数据
      const defaultFilterType = 'text'
      return this.columns
        .filter(col => { return col.filter })
        .map(col => {
          const fieldOptions = {}
          Object.keys(col).filter(k => (k.startsWith('filter') && !k.endsWith('slot')))
            .map(k => ({
              origin: k,
              target: k.replace(/^filter/, '').replace(/^\S/, s => s.toLowerCase())
            }))
            .filter(kobj => kobj.target !== '')
            .forEach(kobj => (fieldOptions[kobj.target] = col[kobj.origin]))
          return Object.assign({}, fieldOptions, {
            action: col.formAction || col.action,
            filterSlot: col.filterSlot,
            title: col.title,
            options: col.options,
            type: col.filterType || col.type || defaultFilterType,
            key: col.dataIndex,
            showTime: col.showTime,
            default: col.default,
            allowClear: col.allowClear,
            disabled: col.disabled,
            disabledDate: col.disabledDate
          })
        })
    },
    slotFilterFields () {
      // 挂载的子项
      return this.filterFields.filter(item => (item.filterSlot))
    }
  },
  data () {
    return {
      filterLoading: false
    }
  },
  methods: {
    handleFilterSubmit (queryParams) {
      // 处理筛选提交事件 向上提交
      this.filterLoading = true
      const finish = () => { this.filterLoading = false }
      this.$emit('on-filter-submit', queryParams, finish)
    },
    handleFilterReset () {
      // 重置筛选项
      this.filterLoading = true
      const finish = () => { this.filterLoading = false }
      this.$emit('on-filter-reset', finish)
    }
  }
}
