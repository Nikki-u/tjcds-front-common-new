<template>
  <div class="amap-page-container">
    <a-input
      class="search-input"
      placeholder="请输入地理位置"
      style="width: 360px"
      v-model="searchValue"
      size="large"
      v-if="!disabled"
    >
      <a-icon slot="suffix" :type="searchComlate?'close':'search'" style="font-size: 16px;line-height:22px;cursor:pointer" @click="onSearch(searchValue)"/>
    </a-input>
    <div id="panel" v-if="searchComlate" :style="{height:200+'px',overflow:'auto',width:'360px',position:'absolute',left:'20px',top:'60px',zIndex:'11'}"></div>
    <el-amap
      :vid="'location-picker' + _uid"
      :center="mapCenter"
      :zoom="12"
      :events="{
        click: handleMapClick,
        complete:handleMapComplete
      }"
      style="height: 100%;"
    >
      <el-amap-marker v-if="position" v-bind="pointOptions" :position="position"></el-amap-marker>
      <el-amap-info-window
        v-if="!disabled && position"
        v-bind="detailOptions"
        :visible="addressVisible"
        :offset="[0, -30]"
        :position="position"
        :events="{
          close: handleDetailClose
        }"
      >
        <ul style="color: dimgrey;font-size: 15px;">
          <li>点击右上x清除点位</li>
          <li>点击其他位置重新选点</li>
        </ul>
      </el-amap-info-window>
    </el-amap>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
VueAMap.initAMapApiLoader({
  key: 'efa2d531ff411f63c7afc2ef5f4d8221',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.MouseTool',
    'AMap.PolyEditor'
  ],
  v: '1.4.10',
  uiVersion: '1.0.11'
})
let geocoder
export default {
  name: 'LocationPicker',
  props: {
    value: {
      type: Array,
      default: () => {
        return null
      }
    },
    defaultCenter: {
      type: Array,
      default: () => {
        return [117.821013, 38.977696]
      }
    },
    // see https://elemefe.github.io/vue-amap/#/zh-cn/coverings/marker
    pointOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    detailOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    searchOption: {
      type: Object,
      default: () => {
        return {
          city: '天津',
          citylimit: true
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      position: null,
      mapCenter: this.defaultCenter,
      addressVisible: false,
      historyVal: null,
      ops: {},
      searchResult: [],
      searchValue: '',
      searchComlate: false
    }
  },
  methods: {
    handleMapComplete () {
      geocoder = new window.AMap.PlaceSearch({
        city: this.searchOption.city, // 城市设为北京，默认：“全国”
        panel: 'panel',
        autoFitView: true,
        citylimit: this.searchOption.citylimit
      })
    },
    onSearch (val) {
      if (val) {
        if (this.searchComlate) {
          geocoder.clear()
          this.searchComlate = false
        } else {
          this.searchComlate = true
          geocoder.search(val, (status, result) => {
            if (status === 'complete') {
              this.searchComlate = true
            } else {
              alert('根据地址查询位置失败')
            }
          })
          geocoder.on('listElementClick', (obj) => {
            this.searchValue = obj.data.name
            var lnglat = obj.data.location
            this.showPoint(lnglat.lng, lnglat.lat)
            this.mapCenter = [lnglat.lng, lnglat.lat]
            geocoder.clear()
            this.searchComlate = false
          })
        }
      } else {
        this.searchComlate = false
      }
    },
    showPoint (lng, lat) {
      this.position = [lng, lat]
      this.addressVisible = !this.disabled
    },
    handleMapClick (e) {
      if (this.disabled) {
        return
      }
      this.showPoint(e.lnglat.lng, e.lnglat.lat)
    },
    handleDetailClose () {
      this.position = null
      this.addressVisible = false
    },
    onSearchResult (pois) {
      const poi = pois[0]
      this.showPoint(poi.lng, poi.lat)
    }
  },
  watch: {
    value: {
      handler (val) {
        if (val && Array.isArray(val) && val.length === 2) {
          if (this.historyVal === null) {
            this.$nextTick(() => (this.mapCenter = val))
          }
          this.position = val
          this.addressVisible = true
        } else {
          this.historyVal = null
        }
      },
      immediate: true
    },
    position (val) {
      this.historyVal = val
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="less">
.amap-page-container {
  position: relative;
  .search-input {
    position: absolute;
    top: 25px;
    left: 20px;
    z-index: 11;
  }
}
</style>
