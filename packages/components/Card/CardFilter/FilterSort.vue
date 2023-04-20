<template>
  <a-form-item label="排序" class="sort-button-zone">
    <a-button v-for="(sort, index) in sorts" :key="index" @click="handleClick(sort)">
      <a-icon :type="sort.icon" />{{ sort.label }}
      <a-icon :type="iconFilter(sort.order)" />
    </a-button>
  </a-form-item>
</template>

<script>
export default {
  name: 'FilterSort',
  props: {
    // 排序字段 {key, label, icon, order}
    sorts: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    // 图标过滤
    iconFilter (order) {
      return order ? order === 'desc' ? 'arrow-down' : 'arrow-up' : '  '
    },
    // 响应点击
    handleClick (sort) {
      this.sorts.forEach((item, index) => {
        if (item.key !== sort.key) {
          item.order = null
        } else {
          item.order = item.order ? item.order === 'desc' ? 'asc' : 'desc' : 'desc'
        }
      })
      this.$emit('on-sort', sort)
    }
  }
}
</script>

<style type="less">
  .sort-button-zone{
    margin:0!important;
    padding:0!important;
  }
  .sort-button-zone .ant-btn {
      border: none;
      box-shadow: none;
      -webkit-box-shadow: none;
      margin-right: 8px;
      margin-bottom: 0;
  }
  .sort-button-zone .ant-btn .anticon {
    width: 14px;
  }
</style>
