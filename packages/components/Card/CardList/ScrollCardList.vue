<template>
  <div
    v-infinite-scroll="handleInfiniteOnLoad"
    :infinite-scroll-disabled="scrollDisabled"
    :infinite-scroll-distance="distance"
  >
    <a-list
      :grid="grid"
      :dataSource="renderResource">
      <a-list-item slot="renderItem" slot-scope="resource, index" :name="index">
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
              <a-icon type="form" />
              <span>{{ addActionText }}</span>
            </span>
          </div>
        </a-card>
      </a-list-item>
      <div v-if="loading && hasMore" class="card-list-loading-container">
        <a-spin />
      </div>
      <a-divider v-show="!hasMore">{{ noMoreText }}</a-divider>
    </a-list>
  </div>
</template>
<script>
import CardListItem from './CardListItem'
import cardListMixins from './mixins/CardListMixins'
import infiniteScroll from './directive/scroll'
export default {
  name: 'ScrollCardList',
  directives: { infiniteScroll },
  mixins: [cardListMixins],
  components: {
    CardListItem
  },
  props: {
    // 触发加载事件的距离
    distance: {
      type: Number,
      default: 10
    },
    // 没有更多数据
    hasMore: {
      type: Boolean,
      default: true
    },
    noMoreText: {
      type: String,
      default: '没有更多的资源'
    },
    hoverable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    scrollDisabled () {
      return this.hasMore === false
    }
  },
  methods: {
    handleInfiniteOnLoad () {
      // 下拉加载事件
      this.$emit('on-load-more')
    }
  }
}
</script>
<style lang="less" scoped>
.card-list-item {
  margin-bottom: 20px;
}
.card-list-loading-container {
  position: absolute;
  bottom: 40px;
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
