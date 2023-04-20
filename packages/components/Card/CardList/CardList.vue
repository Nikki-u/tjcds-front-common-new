<template>
  <div>
    <scroll-card-list v-if="type === 'scroll'" v-bind="$attrs" v-on="$listeners" @on-img-click="handleImgClick" />
    <pagination-card-list v-else v-bind="$attrs" v-on="$listeners" @on-img-click="handleImgClick"/>
    <a-modal
      :title="perviewRes.name"
      v-model="perview"
      :footer="null">
      <img style="width: 100%; height: 100%;" :src="perviewRes.src"/>
    </a-modal>
  </div>
</template>
<script>
import PaginationCardList from './PaginationCardList'
import ScrollCardList from './ScrollCardList'
export default {
  name: 'CardList',
  components: {
    PaginationCardList,
    ScrollCardList
  },
  props: {
    // pagination or scroll
    type: {
      type: String,
      default: 'pagination'
    }
  },
  data () {
    return {
      perview: false,
      perviewRes: {}
    }
  },
  methods: {
    handleImgClick (resource) {
      if (!resource.src) {
        return
      }
      this.perview = true
      this.perviewRes = resource
    }
  }
}
</script>
