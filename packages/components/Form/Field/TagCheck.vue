<template>
  <div ref="tag-box">
    <a-checkable-tag
      style="cursor: pointer;"
      key="all"
      :checked="checkedAll"
      @change="handleCheckedAll"
    >全部</a-checkable-tag>
    <a-checkable-tag
      style="cursor: pointer;"
      v-for="(option, index) in options"
      v-show="index < showTagLength"
      :key="index"
      :checked="option.checked"
      @change="(checked) => handleChecked(option, checked)"
    ><a-avatar v-if="option.icon" :src="option.icon" />
      <a-avatar v-if="option.iconfont" :size="14" :style="{backgroundColor: option.iconfont.color,marginRight:'3px',marginTop:'-4px'}"><icon-font :type=" option.iconfont.type" style="font-size:14px;"/></a-avatar>
      {{ option.label }}
    </a-checkable-tag>
    <tooltip-button
      v-if="maxTagCount !== 0"
      type="default"
      :style="{ border: 'none' }"
      :icon="collapsed ? 'down' : 'up'"
      @click="togglecollapsed"
    >{{ collapsed ? '展开' : '收起' }}</tooltip-button>
  </div>
</template>

<script>
export default {
  name: 'TagCheck',
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      // 默认是收起状态
      collapsed: false,
      // tag盒的宽度
      tagBoxWidth: 0,
      // 能够展示的最大tag数量
      maxTagCount: 0,
      selectedTags: [],
      checkedAll: false
    }
  },
  computed: {
    showTagLength () {
      if (this.maxTagCount !== 0 && this.collapsed) {
        return this.maxTagCount
      } else {
        return this.options.length
      }
    }
  },
  mounted () {
    const self = this
    if (self.$refs['tag-box']) {
      self.tagBoxWidth = self.$refs['tag-box'].clientWidth
    }
    window.addEventListener('resize', () => {
      if (self.$refs['tag-box'] && self.$refs['tag-box'].clientWidth) {
        self.tagBoxWidth = self.$refs['tag-box'].clientWidth
      }
    })
  },
  methods: {
    // 响应选中
    handleChecked (option, checked) {
      option.checked = checked
      this.selectedTags = checked
        ? [...this.selectedTags, option]
        : this.selectedTags.filter(tag => tag.label !== option.label)
      const unChecked = this.options.filter(item => item.checked === false || item.checked === undefined || item.checked === null)
      this.checkedAll = unChecked.length <= 0
      this.$emit('change', this.selectedTags)
    },
    // 响应全选
    handleCheckedAll (checked) {
      this.checkedAll = checked
      this.selectedTags = []
      this.options.forEach(option => {
        option.checked = checked
      })
      if (this.checkedAll) {
        this.options.forEach(option => {
          this.selectedTags.push(option)
        })
      }
      this.$emit('change', this.selectedTags)
    },
    // 响应展开收起
    togglecollapsed () {
      this.collapsed = !this.collapsed
    }
  },
  watch: {
    tagBoxWidth (val) {
      const $tags = this.$refs['tag-box'].children
      let $tagsWidth = 0
      for (let i = 0; i < $tags.length; i++) {
        $tagsWidth += $tags[i].offsetWidth + 8
        if ($tagsWidth >= val) {
          this.maxTagCount = i - 2
          this.collapsed = true
          break
        }
      }
    },
    options () {
      const self = this
      if (self.$refs['tag-box']) {
        self.tagBoxWidth = self.$refs['tag-box'].clientWidth
      }
      const attr = []
      this.selectedTags.forEach(item => {
        this.options.forEach(param => {
          if (item.label === param.label && item.checked) {
            attr.push(item)
          }
        })
      })
      this.selectedTags = attr
      this.$emit('change', this.selectedTags)
    }
  }
}
</script>
