<template>
  <div class="eleMap" ref="eleMap" style="width:100%;height:100%;" id="eleMap" xmlns="http://www.w3.org/1999/xhtml">
    <el-amap
      v-if="reFresh"
      vid="amap"
      :center="mapCenter"
      :zoom="mapZoom"
      :zooms="zooms"
      :amap-manager="amapManager"
      :events="events">
      <el-amap-marker
        v-for="(marker, index) in markers"
        v-if="marker.position"
        :icon="marker.icon?marker.icon:null"
        :offset="marker.offset?marker.offset:[0,0]"
        :key="index"
        :position="marker.position"
        :events="markerEvents"
        :extData="marker"
        :content="marker.iconContent?marker.iconContent:null"
        :angle="marker.angle?marker.angle:0"
        :label="(marker.label&&mapZoom>12&&marker.type==='boat')?marker.label:{}"
        :vid="index">
      </el-amap-marker>
      <el-amap-polygon
        v-for="(polygon, index) in polygons"
        :vid="index"
        :key="index+'s'"
        :path="polygon.path"
        :strokeColor="polygon.color?polygon.color:'#3e86f1'"
        :fillColor="polygon.color?polygon.color:'#3e86f1'"
        fillOpacity="0.5">
      </el-amap-polygon>
      <el-amap-polyline
        v-for="(polyline, index) in polylines"
        :vid="index"
        :key="index+'s'"
        :path="polyline.path"
        :strokeColor="polyline.color?polyline.color:'#3e86f1'"
        :fillColor="polyline.color?polyline.color:'#3e86f1'"
        fillOpacity="0.2" >
      </el-amap-polyline>
      <el-amap-info-window v-if="infoWindow" :position="infoWindow.position" :offset="infoWindow.offset" :content="infoWindow.template">
      </el-amap-info-window>
    </el-amap>
    <div class="map-search-content">
      <a-input
        placeholder="搜索港区、企业、设施等"
        style="width: 363px"
        :value="searchValue"
        @change="onSearchChange"
        @click="handleSearchClick"
        size="large"
      >
        <a-spin slot="suffix" v-if="loading">
          <a-icon slot="indicator" type="loading" style="font-size: 16px;line-height:22px;" spin />
        </a-spin>
        <a-icon slot="suffix" v-else type="search"/>
      </a-input>
      <a-button size="large" style="background:#f8f8f8;" @click="handleCloseClick"><icon-font :type="naviStatus||searchContent?'iconguanbi':'icondaohang2'" /></a-button>
    </div>
    <div class="map-right-action-content" :style="{right:(mapActions.userSettings?'80px':'20px')}">
      <template v-if="mapActions.layers">
        <a-dropdown placement="bottomCenter">
          <a-button >
            <icon-font type="iconmap" />
            <span v-if="screenWidth>1050">{{ curLayers[0] }}</span>
          </a-button>
          <a-menu slot="overlay" @click="handleLayer" v-model="curLayers">
            <a-menu-item key="矢量">
              <icon-font type="iconmap" />矢量
            </a-menu-item>
            <a-menu-item key="卫星">
              <icon-font type="iconweixing" />卫星
            </a-menu-item>
            <a-menu-item key="海图">
              <icon-font type="iconlang" />海图
            </a-menu-item>
            <!-- <a-menu-item key="三维">
              <icon-font type="iconlianqiu" />三维
            </a-menu-item> -->
          </a-menu>
        </a-dropdown>
      </template>
      <a-divider :dashed="true" type="vertical" v-if="mapActions.layers"/>
      <a-button v-if="mapActions.traffic" :class="trafficStatus?'active':''" @click="handleTraffic"><icon-font type="iconweibiaoti-_huabanfuben" /><span v-if="screenWidth>1050">路况</span></a-button>
      <a-divider :dashed="true" type="vertical" v-if="mapActions.traffic"/>
      <a-button v-if="mapActions.weather" :class="weatherStatus?'active':''" @click="handleWeather"><icon-font type="icontianqi" /><span v-if="screenWidth>1050">天气</span></a-button>
      <a-divider :dashed="true" type="vertical" v-if="mapActions.weather"/>
      <a-button v-if="mapActions.monitor" :class="monitorStatus?'active':''" @click="handleMonitor"><icon-font type="iconjiankong" /><span v-if="screenWidth>1050">监控</span></a-button>
      <a-divider :dashed="true" type="vertical" v-if="mapActions.monitor"/>
      <template v-if="mapActions.statistic">
        <a-dropdown placement="bottomCenter">
          <a-button >
            <icon-font type="iconlianqiu" />
            <span v-if="screenWidth>1050">统计</span>
          </a-button>
          <a-menu slot="overlay" @click="handleStatistic" v-model="curStatistic">
            <a-menu-item key="框选">
              <icon-font type="iconweixing" />框选
            </a-menu-item>
            <a-menu-item key="圆选">
              <icon-font type="iconlang" />圆选
            </a-menu-item>
            <a-menu-item key="多边形选">
              <icon-font type="iconlianqiu" />多边形选
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
      <a-divider :dashed="true" type="vertical" v-if="mapActions.statistic"/>
      <Measure v-if="mapActions.measure" :screenWidth="screenWidth" :map="map"></Measure>
    <!-- <a-divider :dashed="true" type="vertical" v-if="mapActions.measure"/> -->
    <!-- <a-button v-if="mapActions.print" @click="print" ><icon-font type="icondayin" /><span v-if="screenWidth>1050">打印</span></a-button> -->
    </div>
    <div id="map-theme-placement" v-if="mapActions.userSettings">
      <a-popover placement="bottomRight" class="icontheme" trigger="click" :visible="popVisible" @visibleChange="handleHoverChange">
        <template slot="content">
          <p v-for="(item,index) in actionSettings" :key="index" @click="handlePersonalAction(item)" style="cursor:pointer">
            <icon-font :type="item.icon" />{{ item.title }}
          </p>
          <div>
            <p><icon-font type="icontheme" />主题</p>
            <a-radio-group @change="onThemeChange" v-model="mapTheme">
              <div class="map-theme-cont">
                <a-radio-button value="normal" class="normal">
                  <div v-if="mapTheme==='normal'" class="theme-checked"><a-icon type="check" /></div>
                </a-radio-button>
                <p>标准</p>
              </div>
              <div class="map-theme-cont">
                <a-radio-button value="blue" class="blue">
                  <div v-if="mapTheme==='blue'" class="theme-checked"><a-icon type="check" /></div>
                </a-radio-button>
                <p>靛青蓝</p>
              </div>
              <div class="map-theme-cont">
                <a-radio-button value="dark" class="dark">
                  <div v-if="mapTheme==='dark'" class="theme-checked"><a-icon type="check" /></div>
                </a-radio-button>
                <p>幻影黑</p>
              </div>
            </a-radio-group>
          </div>
          <p v-if="appCenterUrl" @click="toApp(appCenterUrl)" style="cursor:pointer;"><icon-font type="iconhome" />应用中心</p>
          <p @click="logout" style="cursor:pointer;"><icon-font type="iconicon" />退出登录</p>
        </template>
        <a-avatar :src="this.user.icon" :srcSet="errorPic" size="large" :loadError="loadError"/>
      </a-popover>
    </div>
    <a-card class="map-action-content">
      <!-- <vue-scroll :style="{height:(searchContent?screenHeight-200:0)+'px',overflowY:'auto'}" :ops="ops"> -->
      <div style="padding: 0 10px 10px;" v-if="searchContent">
        <slot name="content"></slot>
      </div>
      <!-- </vue-scroll> -->
      <MapNavi v-bind="$attrs" :naviStatus="naviStatus" :map="map"></MapNavi>
      <vue-scroll :style="{maxHeight:(screenHeight-400)+'px',overflowY:'auto'}" :ops="ops" v-if="naviStatus">
        <div id="panel"></div>
      </vue-scroll>
      <MapDetail
        v-model="detailVisible"
        :markerDetail="markerDetail"
        :screenHeight="screenHeight"
        @rebackDetail="rebackDetail"
        @on-visible-change="handleVisibleChange"
        @on-point-collect="handlePointCollect"
        @on-extBtn-click="handleExtBtn"
      >
        <slot name="markerDetailSlot" slot="markerDetailSlot"></slot>
        <slot name="detailHeadSlot" slot="detailHeadSlot"></slot>
        <slot name="detailBodySlot" slot="detailBodySlot"></slot>
      </MapDetail>
    </a-card>
    <a-modal
      title="统计"
      :visible="staticModal"
      :footer="null"
      @cancel="handleOk"
    >
      <slot name="statisticContent"></slot>
    </a-modal>
  </div>
</template>
<script>
import './style.less'
// 初始化地图
import VueAMap, { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
import Measure from './Measure/Measure'
// 测量
import print from './mixins/print.js'
// 打印
import handleWeather from './mixins/weather.js'
import changeLayer from './mixins/changeLayer.js'
import handleStatistic from './mixins/handleStatistic.js'
import paintPathLine from './mixins/paintPathLine.js'
import { IconFont } from '../Icon'
import MapNavi from './MapNavi/MapNavi'
import MapDetail from './MapDetail/MapDetail'
import '../Icon/iconfont/iconfont.css'
VueAMap.initAMapApiLoader({
  key: 'efa2d531ff411f63c7afc2ef5f4d8221',
  plugin: [
    'AMap.ControlBar',
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.MouseTool',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.MarkerClusterer',
    'AMap.Geocoder',
    'AMap.Weather',
    'AMap.Driving',
    'AMap.Transfer',
    'AMap.Walking',
    'AMap.Object3DLayer'
  ],
  v: '1.4.15',
  uiVersion: '1.0.11'
})
lazyAMapApiLoaderInstance.load().then(() => {
  const amapKeys = Object.keys(localStorage).filter(key => key.match(/^_AMap_/))
  amapKeys.forEach(key => {
    localStorage.removeItem(key)
  })
})
const amapManager = new AMapManager()
let trafficLayer
let $vue, last, markerClusterer
export default {
  name: 'MapContent',
  components: {
    IconFont,
    MapNavi,
    MapDetail,
    Measure
  },
  mixins: [print, handleWeather, changeLayer, paintPathLine, handleStatistic],
  data () {
    return {
      map: {},
      zooms: [8, 20],
      mapZoom: this.zoom,
      mapCenter: this.center,
      amapManager,
      curLayers: ['矢量'],
      reFresh: true,
      loading: false, // 超级搜索加载状态
      naviStatus: false, // 导航状态
      searchContent: false, // 超级搜索状态
      trafficStatus: false, // 路况状态
      weatherStatus: false, // 天气状态
      monitorStatus: false, // 监控状态
      popVisible: false, // 头像下拉框
      staticModal: false,
      mapTheme: 'normal', // 地图主题
      // 城市坐标数组
      // weatherMarkers: [],
      weatherData: [],
      markerPolyLines: [],
      markerPolygons: [],
      flyNavList: [], // 飞线巡航对象数组
      infoWindow: null,
      searchValue: '',
      curStatistic: [],
      // detailStatus: false,
      errorPic: '',
      detailVisible: false,
      layer: [],
      ops: {
        bar: {
          background: '#c1c1c1',
          size: '6px'
        }
      },
      markerEvents: {// 点位事件
        init: (o) => {
        },
        click: (evt) => {
          $vue.pointClick(evt)
        },
        mouseover: (evt) => {
          this.weatherData = null
          if (evt.target.getExtData().type !== 'weather' && evt.target.getExtData().type !== 'everest') {
            $vue.pointMouseOver(evt)
          } else if (evt.target.getExtData().type === 'weather') {
          }
        },
        mouseout: (e) => {
          this.weatherData = null
          if (e.target.getExtData().type !== 'weather' && e.target.getExtData().type !== 'everest') {
            $vue.pointMouseOut()
          } else {
            // $vue.infoWindow = null
          }
        }
      },
      events: {
        init (o) {
          $vue.map = o
          o.setMapStyle('amap://styles/ba9dc3bd0fdf3b9dae118c289a46f7e8')
          if ($vue.mapTheme) {
            const styleName = 'amap://styles/' + $vue.mapTheme
            $vue.map.setMapStyle(styleName)
          }
        },
        complete () {
          $vue.$emit('mapComplete', $vue.getMapInfo())
          // 添加 3D 罗盘控制
          $vue.map.plugin(['AMap.ControlBar', 'AMap.Geocoder', 'AMap.Driving', 'AMap.Transfer', 'AMap.Walking', 'AMap.Object3DLayer'], function () {
            var controlBar = new window.AMap.ControlBar({ position: { right: '20px', bottom: '20px' } })
            $vue.map.addControl(controlBar)
          })
          trafficLayer = new window.AMap.TileLayer.Traffic({
            zIndex: 10
          })
        },
        zoomchange (e) {
          $vue.infoWindow = false
          this.polygons = []
          this.polylines = []
          $vue.$emit('moveend', $vue.getMapInfo())
        },
        moveend () {
          this.polygons = []
          this.polylines = []
          $vue.$emit('moveend', $vue.getMapInfo())
        },
        click (e) {
          $vue.popVisible = false
        }
      },
      dataURL: ''
    }
  },
  computed: {
    // 点
    markers () {
      const newObj = {}
      const flyMarkers = []
      const newList = []
      if (!this.cluster) {
        if (this.flyLines.length > 0) {
          this.flyLines.forEach(item => {
            Object.keys(item).forEach(marker => {
              if (marker === 'startMarker' || marker === 'endMarker') { flyMarkers.push(item[marker]) }
            })
          })
        }
        Object.assign(newObj, this.propMarkers, { flyMarkers: flyMarkers })
        if (newObj) {
          Object.keys(newObj).forEach(function (key) {
            newObj[key].forEach(item => {
              newList.push(item)
            })
          })
        }
      }
      return newList
    },
    // 线
    polylines () {
      return this.propPolylines.concat(this.markerPolyLines)
    },
    // 面
    polygons () {
      return this.propPolygons.concat(this.markerPolygons)
    },
    // 聚合点位数组
    markersClusters () {
      let newObj = {}
      const newList = []
      if (this.cluster) {
        newObj = this.propMarkers
        Object.keys(newObj).forEach(function (key) {
          newObj[key].forEach(item => {
            newList.push(item)
          })
        })
      }
      return newList
    }
  },
  props: {
    // 中心点
    center: {
      type: Array,
      default: function () {
        return [117.821013, 38.977696]
      }
    },
    // 缩放级别
    zoom: {
      type: Number,
      default: 10
    },
    // 默认图层
    mapLayer: {
      type: Array,
      default: function () {
        return ['矢量']
      }
    },
    screenWidth: {
      type: Number,
      default: 0
    },
    screenHeight: {
      type: Number,
      default: 0
    },
    // 用户信息
    user: {
      type: Object,
      default: () => {
        return { }
      }
    },
    object3DList: {
      type: Array,
      default: () => {
        return []
      }
    },
    actionSettings: {
      type: Array,
      default: () => {
        return []
      }
    },
    cluster: {
      type: Boolean,
      default: false
    },
    // 点(resource,dangerWork,ship,video,propMarkers)
    propMarkers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 点位详情
    markerDetail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 线
    propPolylines: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 面
    propPolygons: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 飞线
    flyLines: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作按钮
    mapActions: {
      type: Object,
      default: () => {
        return {
          layers: true,
          traffic: true,
          weather: true,
          monitor: true,
          statistic: false,
          measure: true,
          print: true,
          userSettings: true
        }
      }
    },
    markerDetailVisible: {
      type: Boolean,
      default: false
    },
    contentStatus: {
      type: Boolean,
      default: false
    },
    menuChange: {
      type: Boolean,
      default: false
    }, // 'http://172.17.64.191:7776/pspsso/'
    appCenterUrl: {
      type: String,
      default: null
    },
    propMapTheme: {
      type: String,
      default: null
    }
  },
  methods: {
    // 超级搜索
    onSearchChange (event) {
      this.searchValue = event.target.value
      this.loading = true
      last = event.timeStamp
      setTimeout(() => {
        if (last - event.timeStamp === 0) {
          this.$emit('on-search', event.target.value)
          this.loading = false
        }
      }, 800)
    },
    // 获取地图的缩放及边界
    getMapInfo () {
      this.mapZoom = this.map.getZoom()
      return {
        zoom: this.map.getZoom(),
        southwest: [this.map.getBounds().southwest.lng, this.map.getBounds().southwest.lat],
        northeast: [this.map.getBounds().northeast.lng, this.map.getBounds().northeast.lat]
      }
    },
    // 超级搜索input点击
    handleSearchClick () {
      if (!this.naviStatus) {
        this.searchContent = true
        this.$emit('on-search-click', true)
      }
    },
    // 路况
    handleTraffic () {
      this.trafficStatus = !this.trafficStatus
      trafficLayer.setMap($vue.map)
      if (this.trafficStatus) {
        trafficLayer.show()
      } else {
        trafficLayer.hide()
      }
    },
    // 监控
    handleMonitor () {
      this.monitorStatus = !this.monitorStatus
      this.$emit('on-monitor-click', this.monitorStatus)
    },
    pointClick (evt) {
      this.mapCenter = [evt.target.getPosition().lng, evt.target.getPosition().lat]
      if (!this.naviStatus && evt.target.getExtData().type !== 'weather') {
        $vue.$emit('on-point-click', evt.target, evt.target.getExtData())
      }
      if (evt.target.getExtData().type !== 'everest' && evt.target.getExtData().type !== 'weather') {
        let str = ''
        Object.keys(evt.target.getExtData().desc).forEach(item => {
          str += '<p><span class="detail_label">' + item + ':</span><span class="detail_content">' + evt.target.getExtData().desc[item] + '</span></p>'
        })
        this.infoWindow = {
          position: [evt.target.getPosition().lng, evt.target.getPosition().lat],
          offset: evt.target.getExtData().offset,
          template: str
        }
      }
    },
    pointMouseOver (e) {
      this.markerPolyLines = []
      this.markerPolygons = []
      this.infoWindow = {
        position: [e.target.getPosition().lng, e.target.getPosition().lat],
        offset: e.target.getExtData().offset,
        template: e.target.getExtData().name
      }
      if (e.target.getExtData().space && e.target.getExtData().space.type === 'polyline') {
        e.target.getExtData().space.data.forEach(item => {
          this.markerPolyLines.push({ path: item, color: e.target.getExtData().space.color })
        })
      } else if (e.target.getExtData().space && e.target.getExtData().space.type === 'polygon') {
        e.target.getExtData().space.data.forEach(item => {
          this.markerPolygons.push({ path: item, color: e.target.getExtData().space.color })
        })
      }
    },
    pointMouseOut () {
      this.infoWindow = null
      this.markerPolyLines = []
      this.markerPolygons = []
    },
    closeWeather () {
      this.infoWindow = null
      this.weatherData = null
    },
    // 关闭搜索或gps功能
    handleCloseClick () {
      if (this.searchContent || this.naviStatus) {
        this.searchValue = ''
        this.naviStatus = false
        this.searchContent = false
        this.$emit('on-close-click')
      } else {
        this.naviStatus = true
      }
    },
    // 关闭详情
    rebackDetail () {
      this.infoWindow = null
      this.detailStatus = false
    },
    // 切换主题
    onThemeChange (evt) {
      this.mapTheme = evt.target.value
      const styleName = 'amap://styles/' + this.mapTheme
      $vue.map.setMapStyle(styleName)
      this.$emit('on-theme-change', this.mapTheme)
    },
    // 用户模块配置
    handlePersonalAction (item) {
      this.$emit('on-personal-action', item)
    },
    // 头像下拉框change事件
    handleHoverChange (visible) {
      this.popVisible = visible
    },
    loadError () {
      this.errorPic = this.user.defaultIcon
    },
    // 退出登录
    logout () {
      this.popVisible = false
      this.$emit('logout')
    },
    // detail模态框改变
    handleVisibleChange (val) {
      this.detailVisible = val
      this.$emit('on-visible-change', val)
    },
    // 收藏点
    handlePointCollect (detail) {
      this.$emit('on-point-collect', detail)
    },
    handleExtBtn (val, detail) {
      this.$emit('on-extBtn-click', val, detail)
    },
    toApp (url) {
      window.location.href = url
    }
  },
  watch: {
    zoom (val) {
      this.mapZoom = val
    },
    center (val) {
      this.mapCenter = val
    },
    flyLines (val) {
      if (this.flyNavList.length > 0) {
        this.flyNavList.forEach((item, index) => {
          item.navg.destroy()
          item.line.setData([])
        })
      }
      if (val.length > 0) {
        $vue.paintPathLine()
      }
    },
    markerDetail (val) {
      if (val && JSON.stringify(val) !== '{}') {
        this.detailStatus = true
        if (val.infoWindow !== 'hide') {
          this.infoWindow = {
            position: [val.position[0], val.position[1]],
            offset: val.offset ? [val.offset[0], val.offset[1]] : [-10, -34],
            template: '<p>' + val.name + '</p>'
          }
        }
      }
    },
    markerDetailVisible (val) {
      this.detailVisible = val
    },
    markersClusters (val) {
      const markers = []
      if (markerClusterer) {
        markerClusterer.clearMarkers()
        markerClusterer.setMap(null)
        $vue.map.clearMap()
      }
      if (val.length > 0) {
        for (var i = 0; i < val.length; i += 1) {
          const marker = new window.AMap.Marker({
            position: val[i].position,
            content: val[i].iconContent,
            offset: new window.AMap.Pixel(-15, -15),
            angle: val[i].angle ? val[i].angle : 0,
            extData: val[i]
          })
          marker.on('click', (evt) => {
            this.pointClick(evt)
          })
          marker.on('mouseover', (e) => {
            this.pointMouseOver(e)
          })
          marker.on('mouseout', (e) => {
            this.pointMouseOut(e)
          })
          markers.push(marker)
        }
        $vue.map.plugin(['AMap.MarkerClusterer'], function () {
          markerClusterer = new window.AMap.MarkerClusterer($vue.map, markers, { gridSize: 80, minClusterSize: 5 })
        })
      }
    },
    mapLayer (val) {
      this.curLayers = val
      this.handleLayer({ key: val[0] })
    },
    curLayers (val, oldVal) {
      if (!oldVal[0] === '三维' && val[0] === '三维') {
        $vue.amap = new window.AMap.Map('amap', {
          viewMode: '3D',
          mapStyle: 'amap://styles/midnight',
          pitch: 55
        })
        $vue.amap.setZoom(this.zoom)
        // 添加 3D 罗盘控制
        $vue.amap.addControl(new window.AMap.ControlBar(
          { position: { right: '20px', bottom: '20px' } }
        ))
      } else if (oldVal[0] === '三维' && val[0] !== '三维') {
        this.reFresh = false
        this.$nextTick(() => {
          this.reFresh = true
        })
        this.$emit('on-change-defaultLayer')
      }
    },
    contentStatus (val) {
      this.searchContent = val
    },
    menuChange (val) {
      if (val) {
        this.monitorStatus = false
        this.$emit('on-monitor-click', false)
        this.weatherStatus = false
        this.$emit('on-weather-click', false)
      }
    },
    propMapTheme: {
      immediate: true,
      handler (val, oval) {
        this.mapTheme = val
      },
      deep: true
    }
  },
  mounted () {
    $vue = this
  }
}
</script>
