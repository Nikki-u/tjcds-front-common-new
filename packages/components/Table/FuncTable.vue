<!-- 多功能表格组件 -->
<template>
  <form-table
    ref="formTable"
    :columns="columns"
    :dataSource="tableData"
    :pagination="tablePgination"
    :loading="tableLoading"
    :topbarActions="renderTopbarActions"
    @on-row-action="handleRowAction"
    @on-topbar-action="handleTopbarAction"
    @on-filter-submit="handleFilterSubmit"
    @on-filter-reset="handleFilterReset"
    @on-form-submit="handleFormSubmit"
    @change="handleOptionsChange"
    @on-filter-value-change="handleFilterValueChange"
    @on-value-change="handleFormValueChange"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template
      v-for="key in Object.keys($scopedSlots).filter(k => !Object.keys($slots).includes(k))"
      :slot="key"
      slot-scope="props"
    >
      <slot :name="key" v-bind="props"></slot>
    </template>
    <template v-for="key in Object.keys($slots)" :slot="key">
      <slot :name="key"></slot>
    </template>
  </form-table>
</template>

<script>
import { FormTable } from '../Table'
import { saveAs } from 'file-saver'
export default {
  name: 'FuncTable',
  components: {
    FormTable
  },
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    topbarActions: {
      type: Array,
      default: () => {
        return []
      }
    },
    apiUrl: {
      type: String,
      required: true
    },
    insertAction: {
      type: String,
      default: 'insert'
    },
    insertUrl: {
      type: String,
      default: null
    },
    editAction: {
      type: String,
      default: 'edit'
    },
    editUrl: {
      type: String,
      default: null
    },
    deleteAction: {
      type: String,
      default: 'funcTableDelete'
    },
    deleteUrl: {
      type: String,
      default: null
    },
    detailAction: {
      type: String,
      default: 'funcTableDetail'
    },
    exportAction: {
      type: String,
      default: 'export'
    },
    exportUrl: {
      type: String,
      default: null
    },
    pagination: {
      type: [Boolean, Object],
      default: () => {
        return {
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: true
        }
      }
    },
    extendParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      tablePgination: this.pagination,
      filterParams: {},
      sortParams: {},
      currentEditRow: null,
      currentDeleteRow: null,
      exportLoading: false
    }
  },
  watch: {
    pagination: {
      handler (val) {
        this.tablePgination = val
      },
      deep: true
    },
    extendParams: {
      handler (val) {
        this.loadTableData()
      },
      deep: true
    }
  },
  computed: {
    pagePamrams () {
      // 分页参数
      return this.tablePgination === false
        ? {}
        : {
          curPage: this.tablePgination.current,
          pageSize: this.tablePgination.pageSize
        }
    },
    renderTopbarActions () {
      return this.topbarActions.map(o => {
        if (o.action === this.exportAction) {
          o.loading = this.exportLoading
        }
        return o
      })
    }
  },
  methods: {
    handleFilterSubmit (filterParams, finish) {
      // 处理筛选事件
      this.$emit('on-filter-before', filterParams)
      this.filterParams = filterParams
      if (this.tablePgination !== false) {
        this.tablePgination.current = 1
      }
      this.loadTableData().finally(() => finish())
    },
    handleFilterReset (finish) {
      // 处理筛选重置事件
      this.$emit('on-filter-reset')
      if (Object.keys(this.filterParams).length > 0) {
        this.filterParams = {}
        this.loadTableData().finally(() => finish())
      } else {
        finish()
      }
    },
    handleFormSubmit (action, formParams, finish) {
      // 处理表单提交事件
      this.$emit('on-submit-before', action, formParams)
      switch (action) {
        case 'insert':
          this.insertDataRequest(formParams)
            .then(() => finish())
            .catch(err => {
              console.error(`Process func-table insert action failed with ${err}`)
              finish(true)
            })
          break
        case 'edit':
          this.editDataRequest(formParams)
            .then(() => finish())
            .catch(err => {
              console.error(`Process func-table edit action failed with ${err}`)
              finish(true)
            })
          break
      }
    },
    handleOptionsChange (pagination, filters, sorter) {
      // Ant Design 表格自带的分页/筛选/排序参数改变
      if (pagination && pagination.current) {
        this.tablePgination = pagination
      }
      if (sorter && sorter.column) {
        this.sortParams = {
          orderColumn: sorter.column.dataIndex,
          orderType: { ascend: 'asc', descend: 'desc' }[sorter.order]
        }
      }
      this.loadTableData()
    },
    openInsertFormModal (params) {
      this.$refs['formTable'].openInsertFormModal(params)
    },
    handleTopbarAction (action) {
      // 工具栏点击事件 只处理配置的新增数据动作
      switch (action.action) {
        case this.insertAction:
          this.openInsertFormModal()
          break
        case this.exportAction:
          this.exportDataRequest()
          break
      }
    },
    openEditFormModal (row) {
      this.$refs['formTable'].openEditFormModal(row)
      this.currentEditRow = row
    },
    openDeleteConfirm (row, content, title) {
      this.currentDeleteRow = row
      content = content || '是否确定要进行数据删除操作？'
      title = title || '删除确认'
      const modal = this.$confirm({
        title: title,
        content: content,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        maskClosable: true,
        onOk: () => {
          return this.deleteDataRequest(row).finally(() => modal.destroy())
        }
      })
    },
    openPreviewModal (row) {
      this.$refs['formTable'].openPreviewModal(row)
    },
    handleRowAction (action, column, row) {
      // 行点击事件 只处理配置的编辑数据动作
      switch (action.action) {
        case this.editAction:
          this.openEditFormModal(row)
          break
        case this.deleteAction:
          this.openDeleteConfirm(row)
          break
        case this.detailAction:
          this.openPreviewModal(row)
          break
      }
    },
    insertDataRequest (params) {
      // 新增数据
      const requestUrl = this.formatUrl(this.insertUrl, {}, params)
      return this.$http.post(requestUrl, params).then(result => {
        // 此处服务端如果返回了更新行 则不重新请求服务端数据
        this.$emit('on-insert-success', result)
        const tableData = this.tableData || []
        if (result) {
          result = this.parseResult(result)
          tableData.splice(0, 0, result)
          if (this.tablePgination) {
            this.tablePgination.total++
            // 删除多余的数据
            if (tableData.length > 0 && tableData.length > this.tablePgination.total) {
              tableData.splice(tableData.length - 1, 1)
            }
          }
          this.tableData = tableData
        } else {
          this.loadTableData()
        }
      })
    },
    editDataRequest (params) {
      // 编辑数据
      const currentRow = this.currentEditRow
      const requestUrl = this.formatUrl(this.editUrl, currentRow, params)
      return this.$http.put(requestUrl, Object.assign({}, { id: currentRow.id }, params)).then(result => {
        // 此处如果服务端返回了更新行 则以服务端返回结果为主
        this.$emit('on-edit-success', result)
        result = this.parseResult(result)
        this.currentEditRow = Object.assign(currentRow, Object.assign(params, result))
      })
    },
    deleteDataRequest () {
      const currentRow = this.currentDeleteRow
      const requestUrl = this.formatUrl(this.deleteUrl, currentRow)
      return this.$http.delete(requestUrl).then(result => {
        this.$emit('on-delete-success', result)
        this.refresh()
      })
    },
    exportDataRequest () {
      // 导出数据
      this.exportLoading = true
      const requestParams = this.mergeParams(this.sortParams, this.extendParams, this.filterParams)
      this.$http
        .get(this.exportUrl, { params: requestParams })
        .then(result => {
          this.$emit('on-export-success', result)
          result = this.parseResult(result)
          const url = result.url
          const name = result.name
          saveAs(url, name)
        })
        .finally(() => (this.exportLoading = false))
    },
    formatUrl (templateUrl, currentRow, params) {
      // 如果有占位符则填充
      const replaceObj = Object.assign({}, currentRow, params)
      for (const key in replaceObj) {
        templateUrl = templateUrl.replace(`{${key}}`, replaceObj[key])
      }
      return templateUrl
    },
    loadTableData () {
      // 加载表格数据
      this.tableLoading = true
      const requestParams = this.mergeParams(this.sortParams, this.pagePamrams, this.extendParams, this.filterParams)
      return this.$http
        .get(this.apiUrl, { params: requestParams })
        .then(result => {
          this.$emit('on-data-success', result)
          result = this.parseResult(result)
          if (this.tablePgination) {
            this.tablePgination.total = result.totalCnt
            this.tableData = result.data
          } else {
            this.tableData = result
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // 合并参数
    mergeParams () {
      const args = arguments
      let result = {}
      if (args && args.length > 0) {
        for (const i in args) {
          const arg = args[i]
          result = Object.assign(result, this.dealObjectValue(arg))
        }
      }
      return result
    },
    dealObjectValue (obj) {
      var param = {}
      if (obj === null || obj === undefined || obj === '') return param
      for (var key in obj) {
        if (typeof obj[key] === 'object') {
          param[key] = this.dealObjectValue(obj[key])
        } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
          param[key] = obj[key]
        }
      }
      return param
    },
    parseResult (result) {
      // 兼容解析请求结果
      if (!result) {
        return {}
      }
      if (result.config && result.status && result.request) {
        result = result.data
      }
      return result
    },
    refresh () {
      if (this.tablePgination) {
        this.tablePgination.current = 1
      }
      // 刷新表格
      this.loadTableData()
    },
    handleFilterValueChange (queryParams) {
      this.filterParams = queryParams
      this.$emit('on-filter-value-change', queryParams)
    },
    handleFormValueChange (queryParams) {
      this.$emit('on-value-change', queryParams)
    }
  },
  created () {
    this.loadTableData()
  }
}
</script>
<style>
.ant-table table {
  display: table;
}
</style>
