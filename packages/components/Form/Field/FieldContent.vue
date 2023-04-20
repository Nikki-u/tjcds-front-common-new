<template>
  <span>{{ value }}</span>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    default: {
      type: String,
      default: ''
    }
  },
  watch: {
    default (val) {
      this.$emit('change', val)
    }
  }
}
</script>
