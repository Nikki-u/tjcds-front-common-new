<!-- 资源筛选头信息 -->
<template>
  <section class="resource-filter-header">
    <card-filter
      :fields="fields"
      :search="search"
      :sorts="sorts"
      :actions="actions"
      :displays="displays"
      @submit="handleSubmit"
      @on-sort="handleSort"
      @on-action="handleAction"
      @on-display-change="handleDisplayChange"
      @on-value-change="handleValuesChange"
    >
    </card-filter>
  </section>
</template>

<script>
import resourceServer from '../mixins/resourceServer'
export default {
  name: 'FilterHeader',
  mixins: [resourceServer],
  components: {},
  props: {
    deleteStatus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 表单项
      fields: [
        {
          title: '港区',
          type: 'tagcheck',
          key: 'portArea',
          default: '0',
          options: []
        },
        {
          title: '资源类型',
          type: 'tagcheck',
          key: 'resType',
          options: []
        },
        {
          title: '资源',
          type: 'tagcheck',
          key: 'resource',
          options: []
        },
        // {
        //   title: '企业',
        //   type: 'tagcheck',
        //   key: 'enterprise',
        //   options: []
        // },
        {
          title: '更新时间',
          type: 'datetimeRange',
          key: 'datetimeRange',
          placeholder: ['开始时间', '结束时间']
        },
        {
          title: '包含空间信息',
          type: 'switch',
          key: 'ifSpace',
          defaultChecked: true
        }
      ],
      // 是否显示上部的搜索框
      search: true,
      // 排序字段 {key, label, icon, order}
      sorts: [
        {
          key: 'updateTime',
          label: '更新时间',
          icon: 'clock-circle',
          order: 'desc'
        },
        {
          key: 'resType',
          label: '资源类型',
          icon: 'clock-circle',
          order: ''
        }
      ],
      // 操作按钮 {} 与tipButtons一致
      actions: [
        {
          title: '下载',
          text: '下载',
          icon: 'cloud-download',
          action: 'download',
          type: 'primary',
          ghost: true
        }
      ],
      // 展现形式 {defaultValue, options: [{label, icon, value}]}
      displays: {
        defaultValue: 'card',
        options: [
          {
            label: '资源卡',
            icon: 'appstore',
            value: 'card',
            defaultChecked: true
          },
          {
            label: '数据表',
            icon: 'bars',
            value: 'table'
          }
        ]
      },
      // 码表的选项types
      optionTypeIds: '1,2',
      // 根据ids查询的码表数据
      optionMapData: {},
      // 资源类型的数据
      resTypeData: {},
      // 上一次资源类型的长度
      lastResTypeLength: 0,
      // 上一次资源的数据
      lastResourceData: []
    }
  },
  methods: {
    // 触发表单提交，也就是搜索按钮
    handleSubmit (queryParams, sortParams) {
      Object.assign(queryParams, sortParams)
      this.$emit('on-submit', queryParams)
    },
    // 响应排序
    handleSort (queryParams, sortParams) {
      this.$emit('on-sort', sortParams)
    },
    // 响应操作按钮
    handleAction (action) {
      this.$emit('on-action', action.action)
    },
    //
    handleTagCheck (key, selectedTags) {
      // console.log('tagCheck===' + key + ',' + selectedTags)
    },
    // 响应显示卡变化
    handleDisplayChange (name) {
      this.$emit('on-display-change', name)
    },
    // 由引入混入的组件自定义抛出方式
    handleValuesChange (queryParams, sortParams) {
      console.log('queryParams', queryParams)
      this.buildResData(queryParams)
      console.log('buildResData', queryParams)
      this.$emit('on-filter', queryParams)
    },
    // 构建资源
    buildResData (formParams) {
      if (this.lastResTypeLength === 0 && this.fields['resource'] === undefined) {
        const validateArr = []
        this.fields.forEach(file => {
          if (file.key === 'resource') {
            validateArr.push('存在Resource')
          }
        })
        if (validateArr.length === 0) {
          this.fields.push({
            title: '资源',
            key: 'resource',
            type: 'tag',
            options: []
          })
        }
      }
      this.buildResourceOptions(formParams, this.lastResTypeLength)
    },
    // 构建资源类型对应的选项
    buildResourceOptions (formParams, lastResTypeLength) {
      // 获取当前选中的资源类型
      let filterResourceData = null
      if (this.resTypeData) {
        filterResourceData = this.resTypeData.filter((resType) => {
          if (formParams['resType']) {
            return formParams['resType'].some((formResType) => {
              if (resType.id === formResType.value) return formResType
            })
          }
        })
      }
      // 通过当前选中的资源类型集合和上一次选中的资源类型集合求差集进行新增和删除
      const filterResourceDataIds = filterResourceData.map((fliterResData) => {
        return fliterResData.id
      })
      const lastResourceDataIds = this.lastResourceData.map((lastResData) => {
        return lastResData.id
      })
      const ids = filterResourceDataIds.concat(lastResourceDataIds)
      const differenceId = ids.filter((id) => {
        return filterResourceDataIds.indexOf(id) === -1 || (lastResourceDataIds.indexOf(id) === -1)
      })
      if (filterResourceData.length === lastResTypeLength) return
      // 新增或者删除资源层级选项
      if (filterResourceData.length > lastResTypeLength) {
        const addResData = filterResourceData.filter((filterResData) => {
          return differenceId.some((difference) => {
            if (filterResData.id === difference) return filterResData
          })
        })
        addResData.forEach((resData) => {
          resData.childTypeList.forEach((childRes) => {
            this.fields.forEach((filed) => {
              if (filed.key === 'resource' && childRes.name !== '港口' && childRes.name !== '港区') {
                filed.options.push({
                  label: childRes.name,
                  value: childRes.id
                })
              }
            })
          })
        })
      } else {
        // 删除
        let deleteResData = []
        if (this.lastResourceData.length > 0 && differenceId.length === 1) {
          deleteResData = this.lastResourceData.filter((fliterResData) => {
            return fliterResData.id === differenceId[0]
          })
        } else {
          deleteResData = this.lastResourceData
        }
        const deleteOptions = []
        deleteResData.forEach(deleteRes => {
          deleteRes.childTypeList.forEach(child => {
            deleteOptions.push({ label: child.name, value: child.id })
          })
        })
        this.fields.map(field => {
          if (field.key === 'resource') {
            for (var j = deleteOptions.length - 1; j >= 0; j--) {
              for (var i = field.options.length - 1; i >= 0; i--) {
                if (field.options[i].label === deleteOptions[j].label) {
                  field.options.splice(i, 1)
                }
              }
            }
          }
        })
      }
      this.lastResTypeLength = filterResourceData.length
      this.lastResourceData = filterResourceData
      // console.log('filterResourceData', filterResourceData)
      // 检查筛选对象的resource的值,主要是为了去除 筛选参数中 不属于当前选中的资源类型的资源子项
      const currentTypeOfResourceIds = []
      if (formParams['resource'] && formParams['resource'].length > 0 && filterResourceData && filterResourceData.length > 0) {
        filterResourceData.forEach(resourceType => {
          resourceType['childTypeList'].forEach(resourceOfType => {
            currentTypeOfResourceIds.push(resourceOfType.id)
          })
        })
        formParams['resource'] = formParams['resource'].filter(resource => {
          if (currentTypeOfResourceIds.indexOf(resource.value) > -1) {
            return resource
          }
        })
      } else {
        // 当没有任何资源类型的时候，将资源子项置空
        formParams['resource'] = []
      }
      // console.log('resource', formParams['resource'])
    },
    getResourceData () {
      this.fields[0].options = []
      this.fields[1].options = []
      this.fields[2].options = []
      this.fields[3].options = []
      this.fields[4].options = []
      // 获取所有的资源层级关系
      this.getResTypes().then(response => {
        const data = response
        this.resTypeData = data
        data.forEach(type => {
          this.fields.forEach((field) => {
            if (field.key === 'resType') {
              field.options.push({
                label: type.name,
                value: type.id
              })
            }
          })
        })
      })
      // 获取指定的资源类型选项
      this.getAppointResOptions('port').then(response => {
        const data = response
        if (data.length > 1) {
          this.fields.unshift({
            title: '港口',
            type: 'tagcheck',
            key: 'port',
            default: '0',
            options: []
          })
          data.forEach((option) => {
            this.fields.forEach((field) => {
              if (field.key === 'port') {
                field.options.push({
                  label: option.typeOptionLabel,
                  value: option.typeOptionValue
                })
              }
            })
          })
        }
      })
      this.getAppointResOptions('portArea').then(response => {
        const data = response
        data.forEach((option) => {
          this.fields.forEach((field) => {
            if (field.key === 'portArea') {
              // 防止多次请求
              // field.options = []
              field.options.push({
                label: option.typeOptionLabel,
                value: option.typeOptionValue
              })
            }
          })
        })
      })
      this.getAppointResOptions('resEnterprise').then(response => {
        const data = response
        this.fields.forEach(field => {
          if (field.key === 'enterprise') {
            // field.options = []
            data.forEach(option => {
              field.options.push({
                label: option.typeOptionLabel,
                value: option.typeOptionValue
              })
            })
          }
        })
      })
    }
  },
  created () {
    this.getResourceData()
  },
  mounted () {
  },
  watch: {
    deleteStatus () {
      if (this.deleteStatus) {
        this.getResourceData()
      }
    }
  }
}
</script>

<style lang="less">
.resource-filter-header {
  .ant-form-item-label {
    label {
      width: 120px;
    }
  }
}
</style>
