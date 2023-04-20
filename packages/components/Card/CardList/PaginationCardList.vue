<template>
  <div>
    <a-list
      :grid="grid"
      :dataSource="renderResource">
      <a-list-item slot="renderItem" slot-scope="resource">
        <card-list-item
          v-if="!resource.isUseAddAction"
          :resource="resource"
          :actions="actions"
          :hoverable="hoverable"
          v-on="$listeners"
        ></card-list-item>
        <a-card v-else-if="useAddAction">
          <div class="add-content-wrapper">
            <span class="add-content" @click="handleAddAction">
              <a-icon type="form"/>
              <span>{{ addActionText }}</span>
            </span>
          </div>
        </a-card>
      </a-list-item>
      <div v-if="loading" class="card-list-loading-container">
        <a-spin />
      </div>
    </a-list>
    <a-pagination
      v-if="pagination"
      class="pagination"
      showQuickJumper
      v-model="pagination.page"
      :pageSize="pagination.size"
      :total="pagination.total"
      :showTotal="pagination.showTotal"
      @change="handlePaginationChange" />
  </div>
</template>
<script>
import CardListItem from './CardListItem'
import cardListMixins from './mixins/CardListMixins'
export default {
  name: 'CardList',
  components: {
    CardListItem
  },
  mixins: [cardListMixins],
  props: {
    // 分页配置
    pagination: {
      type: Object,
      default: () => {
        return null
      }
    },
    hoverable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handlePaginationChange  (page, pageSize) {
      // 分页事件
      this.$emit('on-page-change', page, pageSize)
    }
  }
}
</script>
<style lang="less" scoped>
.card-list-item {
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  text-align: center
}
.card-list-loading-container {
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
}
.add-content-wrapper {
  height: 125px;
  width: 100%;
  .add-content {
    text-align: center;
    line-height: 125px;
    font-size: 16px;
    cursor: pointer;
    color: rgba(42, 130, 228, 1);
    display: block;
  }
}
</style>
