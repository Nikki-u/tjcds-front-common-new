<template>
  <span ref="content">
    <a-tooltip v-if="ellipsis" :title="title" placement="topLeft">
      {{ title }}
    </a-tooltip>
    <template v-else>{{ title }}</template>
  </span>
</template>

<script>
export default {
  props: {
    warpComponet: {
      type: String,
      default: 'p'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ellipsis: false,
      clientWidth: 0,
      scrollWidth: 0
    }
  },
  watch: {
    title (val) {
      this.$nextTick(() => this.judgeEllipsis())
    }
  },
  methods: {
    judgeEllipsis () {
      const content = this.$refs.content
      if (content) {
        const warpEle = this.findWarpEle(content)
        // 当前容器的宽度
        this.clientWidth = warpEle.clientWidth
        // 当前文字（包括省略部分）的宽度
        this.scrollWidth = warpEle.scrollWidth
        // 当容器宽度比文字需要宽度更小时 代表需要tooltip
        this.ellipsis = this.clientWidth < this.scrollWidth
      }
    },
    findWarpEle (currentTag) {
      const parentNode = currentTag.parentNode
      if (parentNode) {
        if (parentNode.tagName.toLowerCase() === this.warpComponet) {
          return parentNode
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
