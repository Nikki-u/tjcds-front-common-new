<template>
  <t-icon :type="type"/>
</template>

<script>
// import './iconfont/iconfont.css'
import { Icon } from 'ant-design-vue'
// 支持SSR 防止文档打包异常
const TIcon = typeof window === 'undefined' ? null : Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1258392_b2j53p4rxsj.js'// require('./iconfont.js')
})
export default {
  name: 'IconFont',
  components: {
    TIcon
  },
  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>
