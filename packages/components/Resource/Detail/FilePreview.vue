<template>
  <div>
    <span v-if="fileList && fileList.length > 0">
      <preview-icon
        v-for="item in fileList"
        style="margin-left: 3px;"
        :key="item.key"
        :fileKey="item.key"
        :name="item.name"
        :url="item.url"/>
    </span>
    <span v-else>无附件</span>
  </div>
</template>

<script>
import PreviewIcon from './DocPreviesIcon'
export default {
  name: 'FilePreview',
  components: { PreviewIcon },
  data () {
    return {
    }
  },
  props: {
    fileList: {
      type: Array,
      required: false,
      default: () => { return [] }
    }
  },
  computed: {},
  methods: {},
  watch: {
    fileList (val) {
    }
  },
  created () {},
  mounted () {}
}
</script>
 <style>
 </style>
