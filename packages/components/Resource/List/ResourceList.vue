<template>
  <div>
    <a-spin :spinning="loading">
      <filter-header
        :deleteStatus="deleteStatus"
        @on-filter="handleFilter"
        @on-sort="handleSort"
        @on-display-change="handleDisplayChange"
        @on-action="handleAction"
      />
      <list-content
        class="list-content"
        :displayType="displayType"
        :deleteStatus="deleteStatus"
        :sort="sort"
        :filter="filter"
        v-on="$listeners"
        @loadSuccess="loadSuccess"
      />
    </a-spin>
  </div>
</template>

<script>
import FilterHeader from './FilterHeader'
import ListContent from './ListContent'
import moment from 'moment'
export default {
  name: 'ResourceList',
  components: {
    FilterHeader,
    ListContent
  },
  data () {
    return {
      displayType: 1,
      filter: {},
      sort: {},
      loading: true
    }
  },
  props: {
    deleteStatus: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSort (sortObj) {
      const sort = {}
      if (sortObj.orderColumn === 'updateTime') {
        sort.updateAt = sortObj.orderType
      }
      if (sortObj.orderColumn === 'resType') {
        sort.resType = sortObj.orderType
      }
      this.sort = sort
    },
    handleFilter (filter) {
      const filterParams = {}
      if (filter.ifSpace !== undefined && filter.ifSpace !== null) {
        filterParams.hasSpaceInfo = filter.ifSpace
      }
      if (filter.search) {
        filterParams.query = filter.search
      }
      if (filter.resource) {
        filterParams.resourceTypeIds = filter.resource.map(item => (item.value))
      }
      if (filter.datetimeRange) {
        filterParams.updateAtRange = filter.datetimeRange.map(item => parseInt(item / 1000))// this.handleUnix(filter.datetimeRange.map(item => (this.$moment(item).unix())))
      }
      if (filter.port) {
        filterParams.belongPortIds = filter.port.map(item => (item.value))
      }
      if (filter.portArea) {
        filterParams.belongPortAreaIds = filter.portArea.map(item => (item.value))
      }
      if (filter.enterprise) {
        filterParams.belongEnterpriseIds = filter.enterprise.map(item => (item.value))
      }
      this.filter = filterParams
    },
    handleDisplayChange (type) {
      this.displayType = { card: 1, table: 2 }[type]
    },
    handleAction (action) {
      this.$emit('on-action', action, this.filter, this.sort)
    },
    /**
     * 处理filter筛选类型里面的range，将同一天的时间转换为当天的00：00：00到当天的23:59:59
     */
    handleUnix (array) {
      if (array instanceof Array) {
        const timeRange = []
        const strTime1 = array[0] + ''
        const strTime2 = array[1] + ''
        if (strTime1.substring(0, 6) === strTime2.substring(0, 6)) {
          var datetime = moment(array[0] * 1000).format('YYYY-MM-DD')
          var startDate = moment(datetime).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          timeRange.push(moment(startDate).valueOf() / 1000)
          var endDate = moment(datetime).endOf('day').format('YYYY-MM-DD HH:mm:ss')
          timeRange.push(moment(endDate).valueOf() / 1000)
        }
        return timeRange
      }
    },
    loadSuccess () {
      this.loading = false
    }
  },
  watch: {
    deleteStatus (val) {
      this.loading = val
    }
  }
}
</script>

<style lang="less" scoped>
.list-content {
  margin-top: 20px;
}
</style>
