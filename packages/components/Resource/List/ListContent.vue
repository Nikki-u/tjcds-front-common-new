<template>
  <div>
    <card-list
      v-show="displayType === 1"
      :hoverable="false"
      :dataSource="resourceData"
      :actions="actions"
      :loading="resDataLoading"
      @on-add-action="handleAddResDataAction"
      @on-card-action="handleResDataAction"
      @on-card-click="handleResDataClick"
    />
    <div v-show="displayType === 2">
      <a-card title="资源列表">
        <a-button
          slot="extra"
          icon="form"
          type="primary"
          ghost
          @click="handleAddResDataAction"
        >新增</a-button>
        <format-table
          rowKey="id"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleSelectChange}"
          :columns="columns"
          :dataSource="resourceData"
          :pagination="false"
          :loading="resDataLoading"
          @on-row-action="(action,col,row) => handleResDataAction(action,row)"
        >
          <span
            slot="spaceType"
            slot-scope="{ params }">{{ params[1].hasSpaceInfo?'是':'否' }}</span>
          <span
            slot="type"
            slot-scope="{ params }"
          >
            <a-avatar
              slot="avatar"
              :icon="params[1].resourceTypeId?'':resource.icon"
              :style="{background: params[1].avatarColor?resource.avatarColor: '#3e86f1',marginRight:'5px'}"
              :src="params[1].src"
              :size="30"
            >
              <icon-font :type="'iconresource'+params[1].resourceTypeId"></icon-font>
            </a-avatar>
            <span>{{ params[1].resourceTypeName }}</span>
          </span>
        </format-table>
      </a-card>
    </div>
    <a-pagination
      class="pagination"
      showQuickJumper
      v-model="pagination.page"
      :pageSize="pagination.size"
      :total="pagination.total"
      @change="handlePaginationChange"
    />
  </div>
</template>

<script>
import CardList from '../../Card/CardList/CardList'
import resourceServer from '../mixins/resourceServer'
import moment from 'moment'
moment.locale('zh-cn')
export default {
  name: 'ListContent',
  mixins: [resourceServer],
  components: {
    CardList
  },
  props: {
    // 展示类型 1:卡片 2:列表
    displayType: {
      type: Number,
      default: 1
    },
    filter: {
      type: Object,
      default: null
    },
    sort: {
      type: Object,
      default: () => {
        return { }
      }
    },
    deleteStatus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      resourceData: [],
      selectedRowKeys: [],
      columns: [
        {
          title: '资源名称',
          dataIndex: 'name'
        },
        {
          title: '资源类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '更新时间',
          dataIndex: 'lastTime',
          format: 'formatDate|YYYY-MM-DD HH:mm:ss'
        },
        {
          title: '更新人',
          dataIndex: 'updatePrincipal'
        },
        {
          title: '状态',
          dataIndex: 'updateStatus',
          format: 'formatStatus',
          options: [
            { value: 3, label: '正常', status: 'success' },
            { value: 2, label: '预警', status: 'warning' },
            { value: 1, label: '过期', status: 'error' }
          ]
        },
        {
          title: '包含空间信息',
          dataIndex: 'spaceType',
          scopedSlots: { customRender: 'spaceType' }
        },
        {
          title: '操作',
          actions: [{ text: '查看', action: 'view' }, { text: '编辑', action: 'edit' }, { text: '删除', action: 'delete' }],
          dataIndex: 'action',
          format: 'formatTextActions'
        }
      ],
      actions: [{ text: '查看', action: 'view' }, { text: '编辑', action: 'edit' }, { text: '删除', action: 'delete' }],
      pagination: {
        page: 1,
        size: 11,
        total: 0
      },
      resDataLoading: false
    }
  },
  watch: {
    filter: {
      handler (val) {
        this.$set(this.pagination, 'page', 1)
        this.loadResourceData()
      },
      deep: true
    },
    sort: {
      handler (val) {
        this.$set(this.pagination, 'page', 1)
        this.loadResourceData()
      },
      deep: true
    },
    deleteStatus: {
      handler (val) {
        if (this.deleteStatus) {
          this.loadResourceData()
        }
      },
      deep: true
    }
  },
  methods: {
    handleSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handlePaginationChange (page, pageSize) {
      this.pagination.page = page
      this.pagination.size = pageSize
      this.loadResourceData()
    },
    handleAddResDataAction () {
      this.$emit('on-res-action', 'add')
    },
    handleResDataClick (resData) {
      this.$emit('on-card-click', resData)
    },
    handleResDataAction (action, resData) {
      // view or edit
      this.$emit('on-res-action', action.action, resData)
    },
    loadResourceData () {
      if (this.resDataLoading) return
      this.resDataLoading = true
      this.searchResData(this.filter, this.sort, {
        page: this.pagination.page - 1,
        size: this.pagination.size
      }).then(result => {
        this.$emit('loadSuccess')
        this.pagination.total = result.totalElements
        this.resDataLoading = false
        this.resourceData = result.content.map(item => {
          const updateFromNow = item.updateAt ? moment.unix(item.updateAt).fromNow() : ''
          const overdueTime = item.overdueTime && item.overdueTime.toString().length > 5 ? moment.unix(item.overdueTime).format('YYYY-MM-DD') : ''
          const overdueDays = item.overdueTime && item.overdueTime.toString().length > 5 ? moment.unix(item.overdueTime).diff(moment(), 'days') : ''
          let subscript = {}
          switch (item.updateStatus) {
            case 1:
              subscript = { title: '过期', color: '#fff', tip: `资料于${overdueTime}过期，请您尽快更新`, backgroundColor: '#d43030' }
              break
            case 2:
              subscript = { title: '预警', color: '#fff', tip: `资料将于${overdueDays}天后过期，请及时更新`, backgroundColor: '#ff8d1a' }
              break
            default:
              subscript = { title: '正常', color: '#fff', tip: `资料于${updateFromNow}更新，剩余${overdueDays}天过期`, backgroundColor: 'rgb(62, 175, 124)' }
              break
          }
          return Object.assign(item, {
            name: item.summary,
            icon: item.resourceTypeIcon,
            lastTime: item.updateAt ? moment.unix(item.updateAt).format('YYYY-MM-DD') : '',
            type: item.resourceTypeName,
            hasSpaceInfo: item.spaceType !== 'NONE',
            subscript: subscript
          })
        })
      })
    }
  },
  created () {
    this.loadResourceData()
  }
}
</script>

<style lang="less" scoped>
.card-item {
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
.add-content-wrapper {
  height: 128px;
  width: 100%;
  .add-content {
    text-align: center;
    line-height: 128px;
    font-size: 16px;
    cursor: pointer;
    color: rgba(42, 130, 228, 1);
    display: block;
  }
}
</style>
