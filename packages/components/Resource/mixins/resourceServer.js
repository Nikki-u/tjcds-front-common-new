import moment from 'moment'
export default {
  data () {
    return {}
  },
  methods: {
    /**
     * 获取资源的所有类型
     */
    getResTypes () {
      return this.$http.get(`/tjcds/res/types`)
    },
    /**
     * 获取所有资源配置
     */
    getResConfigs () {
      return this.$http.get(`/tjcds/res`)
    },
    /**
     * 获取码表里面的资源选项
     */
    getResOptionMap (optionTypeIds) {
      return this.$http.get(`/tjcds/res/options/`, {
        params: { optionTypeIds }
      })
    },
    /**
     * 根据资源名称获取指定的资源选项
     * @param {String} resourceName 资源名称
     */
    getAppointResOptions (resourceName) {
      return this.$http.get(`/tjcds/res/appoint/options/${resourceName}`)
    },
    /**
     * 根据资源ID获取资源配置信息
     * @param {Number} resId 资源ID
     */
    getResConfigById (resId) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(`/tjcds/res/${resId}`)
          .then(result => {
            result.fields = result.formItems.filter(field => field.formEntry).map(field => this.formatField(field))
            resolve(result)
          })
          .catch(err => reject(err))
      })
    },
    getResConfigByIdAndFilter (resId, queryParams) {
      return new Promise((resolve, reject) => {
        this.$http.get(`/tjcds/res/${resId}`, { params: queryParams }).then(result => {
          result.fields = result.formItems.filter(field => field.formEntry).map(field => this.formatField(field))
          resolve(result)
        }).catch(err => reject(err))
      })
    },
    /**
     * 根据资源与数据ID获取资源数据详情信息
     * @param {Number} resId 资源ID
     * @param {Number} dataId 资源数据ID
     */
    getResDataById (resId, dataId) {
      return this.$http.get(`/tjcds/res/${resId}/data/${dataId}`)
    },
    /**
     * 搜索资源数据
     * @param {Object} filter 筛选项
     * @param {Object} sort 排序项
     * @param {Object} pagination 分页项
     */
    searchResData (filter, sort, pagination) {
      return this.$http.get(`/tjcds/res/data/search`, {
        params: Object.assign({}, filter, sort, pagination)
      })
    },
    /**
     * 提交资源数据
     * @param {Number} resId 资源ID
     * @param {Array} resData 资源数据列表
     */
    commitResData (resId, resData) {
      return this.$http.post(`/tjcds/res/${resId}/data`, this.formatResData(resData))
    },
    /**
     * 提交资源数据
     * @param {Number} resId 资源ID
     * @param {Number} dataId 资源数据ID
     * @param {Array} resData 资源数据列表
     */
    updateResData (resId, dataId, resData) {
      return this.$http.put(`/tjcds/res/${resId}/data/${dataId}`, this.formatResData(resData))
    },
    /**
     * 格式化为前端组件所需的数据结构
     * @param {Object} field 表单项配置
     */
    formatField (field) {
      return {
        origin: field,
        action: field.action,
        type: field.formItemType.toLowerCase(),
        title: field.formItemLabel,
        key: field.formItemProp,
        options: this.formatOptions(field),
        quickRule: this.formatRules(field),
        placeholder: field.placeholder
      }
    },
    formatRules (field) {
      const rules = JSON.parse(field.formItemRules)
      const ruleObj = {
        origin: field
      }
      ruleObj.required = field.isNullAble === 0
      if (rules) {
        rules.forEach(rule => {
          ruleObj[rule.ruleType.toLowerCase()] = rule.ruleVal
        })
      }
      return ruleObj
    },
    formatOptions (field) {
      if (field.formItemOption && field.formItemOption.length > 0) {
        return field.formItemOption.map(item => ({
          value: item.typeOptionValue,
          label: item.typeOptionLabel
        }))
      }
      return []
    },
    /**
     * 格式化从服务单获取的表单数据
     * @param {Object} formData 从服务端获取到的表单数据
     * @param {Object} resConfig 资源配置
     */
    formatFormData (formData, resConfig) {
      const formatData = {}
      for (const key in formData) {
        formatData[key] = this.formatFormDataItem(key, formData[key], resConfig.formItems)
      }
      return formatData
    },
    formatFormDataItem (key, value, formItems) {
      const option = formItems.find(form => form.formItemProp === key)
      if (option && option.formItemType) {
        switch (option.formItemType.toLowerCase()) {
          case 'datetime':
            return moment.unix(value)
          case 'map':
            return JSON.parse(value)
        }
        return value
      }
    },
    /**
     * 格式化提交给服务端的资源数据
     * @param {Object} resData 资源数据
     */
    formatResData (resData) {
      const resDataArr = []
      for (const key in resData) {
        resDataArr.push({
          formItemProp: key,
          formItemValue: this.formatResDataValue(resData[key])
        })
      }
      return resDataArr
    },
    /**
     * 格式化资源数据
     * @param {Object} value formItemValue
     */
    formatResDataValue (value) {
      if (value instanceof moment) {
        return value.format('X')
      } else if (value instanceof Date) {
        return moment(value).format('X')
      }
      return value
    },
    /**
     * 用于新增，编辑，删除等操作之后的刷新方法，
     * 其他查询还是使用 searchResData 方法
     */
    searchResDataAfterHandle () {
      const filter = {}
      const sort = {
        updateAt: 'desc'
      }
      const pagination = {
        page: 0,
        size: 10
      }
      this.searchResData(filter, sort, pagination)
    }
  }
}
