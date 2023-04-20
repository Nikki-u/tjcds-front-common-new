<template>
  <a-tooltip placement="topLeft">
    <template v-if="ellipsis" slot="title">{{ title }}</template>
    <span ref="content">
      <template v-if="content">{{ content }}</template>
      <slot v-else></slot>
    </span>
  </a-tooltip>
</template>

<script>
export default {
  props: {
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: [String, Number],
      default: null
    },
    warpComponet: {
      type: String,
      default: 'td'
    },
    content: {
      type: String,
      default: ''
    },
    // 用于由于其他元素存在引起的计算偏移
    offset: {
      type: Number,
      default: 0
    }
  },
  watch: {
    column: {
      handler () {
        this.$nextTick(() => this.judgeEllipsis())
      },
      deep: true
    }
  },
  data () {
    return {
      ellipsis: false
    }
  },
  methods: {
    judgeEllipsis () {
      const content = this.$refs.content
      if (content) {
        const warpEle = this.findWarpEle(content)
        if (warpEle) {
          // 当前容器的宽度
          const clientWidth = warpEle.clientWidth
          // 当前文字（包括省略部分）的宽度
          const scrollWidth = warpEle.scrollWidth
          // 当容器宽度比文字需要宽度更小时 代表需要tooltip
          this.ellipsis = clientWidth < scrollWidth - this.offset
        }
      }
    },
    findWarpEle (currentTag) {
      const parentNode = currentTag.parentNode
      if (parentNode) {
        if (parentNode.tagName && typeof parentNode.tagName === 'string') {
          if (parentNode.tagName.toLowerCase() === this.warpComponet) {
            return parentNode
          }
        }
        return this.findWarpEle(parentNode)
      }
    }
  },
  mounted () {
    this.judgeEllipsis()
  }
}
</script>
