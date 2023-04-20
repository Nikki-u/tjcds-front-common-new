export default {
  props: {
    // 资源卡片列表的数据源
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 活动按钮
    actions: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 布局配置
    grid: {
      type: Object,
      default: () => {
        return { gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }
      }
    },
    // 数据加载标识位
    loading: {
      type: Boolean,
      default: false
    },
    // 启用新增按钮
    useAddAction: {
      type: Boolean,
      default: true
    },
    // add card title
    addActionText: {
      type: String,
      default: '新增资源'
    }
  },
  computed: {
    renderResource () {
      const renderResource = this.dataSource.slice()
      if (this.useAddAction) {
        renderResource.splice(0, 0, { isUseAddAction: true })
      }
      return renderResource
    },
    renderPreviewImgs () {
      const renderPreviewImgs = this.dataSource.slice()
        .filter(item => item.iconSrc)
        .map(item => item.iconSrc)
      return renderPreviewImgs
    }
  },
  methods: {
    handleAddAction () {
      // 新增数据活动
      this.$emit('on-add-action')
    }
  }
}
