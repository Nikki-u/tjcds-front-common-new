<template>
  <div class="eleMap spacepicker" ref="pickerMap" style="width:100%;height:100%;" >
    <el-amap
      vid="picker"
      :amap-manager="amapManager"
      :zoom="mapZoom"
      :zooms="zooms"
      :center="mapCenter"
      :events="events"
    >
      <el-amap-info-window
        :position="infoWindow.position"
        :contentRender="infoWindow.contentRender"
        :visible="infoWindow.visible"
        :events="infoWindow.events">
      </el-amap-info-window>
    </el-amap>
    <div class="map-search-content">
      <a-input
        placeholder="请输入地理位置"
        style="width: 360px"
        v-model="searchValue"
        size="large"
      >
        <a-icon slot="suffix" :type="searchComlate?'close':'search'" style="font-size: 16px;line-height:22px;cursor:pointer" @click="onSearch(searchValue)"/>
      </a-input>
      <div id="panel" v-if="searchComlate" :style="{height:200+'px',overflow:'auto',width:'360px'}"></div>
    </div>
    <div class="map-right-action-content" v-if="operType!=='view'">
      <tooltip-button
        title="当前缩放级别"
      >{{ mapZoom }}</tooltip-button>
      <a-divider type="vertical" />
      <tooltip-button
        title="该类型只能添加、编辑点"
        icon="environment"
        v-if="spaceType==='point'"
        :disabled="mapData.length!==0"
        @click="drawPoint">点</tooltip-button>
      <tooltip-button title="该类型只能添加、编辑线" icon="share-alt" v-if="spaceType==='polyline'" @click="drawPolyline">线</tooltip-button>
      <tooltip-button title="该类型只能添加、编辑面" icon="radius-setting" v-if="spaceType==='polygon'" @click="drawPolygon">面</tooltip-button>
    </div>
    <a-card hoverable style="width: 80px;position:absolute;right:20px;bottom:20px;">
      <img
        style="height:60px;"
        alt="example"
        :src="mapLayerImg"
        slot="cover"
        @click="changeMapLayer"
      />
    </a-card>
  </div>
</template>
<script>
import VueAMap, { AMapManager } from 'vue-amap'
import handlePoint from './mixins/handlePoint.js'
import handlePolyline from './mixins/handlePolyline.js'
import handlePolygon from './mixins/handlePolygon.js'
VueAMap.initAMapApiLoader({
  key: 'efa2d531ff411f63c7afc2ef5f4d8221',
  plugin: [
    'AMap.Autocomplete',
    'AMap.ControlBar',
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
const amapManager = new AMapManager()
let $vue
let geocoder, marker
export default {
  name: 'SpacePicker',
  mixins: [handlePoint, handlePolyline, handlePolygon],
  model: {
    prop: 'mapData',
    event: 'input'
  },
  props: {
    center: {
      type: Array,
      default: () => {
        return [117.821013, 38.977696]
      }
    },
    // 空间类型(point,polygon,poline)
    spaceType: {
      type: String,
      default: 'point'
    },
    // 数据
    mapData: {
      type: Array,
      required: false,
      default: function () {
        return []
      }
    },
    // 操作类型 add,edit,view
    operType: {
      type: String,
      default: 'view'
    }
  },
  computed: {
    mapLayerImg () {
      const imgSL = 'data:image/png;base64,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'
      const imgYX = 'data:image/jpg;base64,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'
      return this.mapLayer === '矢量' ? imgSL : imgYX
    }
  },
  data () {
    return {
      searchValue: '',
      screenHeight: 0,
      mapCenter: this.center,
      mapZoom: 12,
      zooms: [8, 16],
      amapManager,
      map: null,
      mouseTool: null,
      searchComlate: false,
      bindObj: null,
      infoWindow: {
        position: [117.821013, 38.977696],
        visible: false,
        contentRender: h => h('a-button', {
          props: {
            icon: 'close',
            size: 'small',
            type: 'danger',
            shape: 'circle'
          },
          on: {
            click: () => {
              const obj = this.bindObj
              let bounds = []
              $vue.map.remove(obj)
              if ($vue.spaceType === 'point') {
                bounds = [obj.getPosition().lng, obj.getPosition().lat]
                if (JSON.stringify($vue.objData) === JSON.stringify(bounds)) {
                  $vue.objData = []
                }
              } else if (this.spaceType === 'polyline') {
                obj.getPath().forEach(line => {
                  bounds.push([line.lng, line.lat])
                })
                $vue.objData.forEach((item, index) => {
                  if (JSON.stringify(item) === JSON.stringify(bounds)) {
                    $vue.objData.splice(index, 1)
                  }
                })
              } else if (this.spaceType === 'polygon') {
                obj.getPath().forEach(line => {
                  bounds.push([line.lng, line.lat])
                })
                $vue.objData.forEach((item, index) => {
                  if (JSON.stringify(item) === JSON.stringify(bounds)) {
                    $vue.objData.splice(index, 1)
                  }
                })
              }
              $vue.infoWindow.visible = false
            }
          }
        }),
        obj: this.bindObj
      },
      events: {
        init (o) {
          $vue.map = o
        },
        complete () {
          $vue.mouseTool = new window.AMap.MouseTool($vue.map)
          $vue.map.setMapStyle('amap://styles/ba9dc3bd0fdf3b9dae118c289a46f7e8')
          $vue.drawOverLayers()
          $vue.handleDefaultTool()
          geocoder = new window.AMap.PlaceSearch({
            city: '022', // 城市设为北京，默认：“全国”
            panel: 'panel',
            autoFitView: true,
            citylimit: true
          })
          // 添加 3D 罗盘控制
          $vue.map.plugin(['AMap.ControlBar', 'AMap.Geocoder', 'AMap.Driving', 'AMap.Transfer', 'AMap.Walking'], function () {
            var controlBar = new window.AMap.ControlBar({ position: { right: '20px', top: '80px' } })
            $vue.map.addControl(controlBar)
          })
        },
        click (event) {
          $vue.infoWindow.visible = false
        },
        zoomchange () {
          $vue.mapZoom = $vue.map.getZoom()
        }
      },
      // state: 'ready', // ready,edit,add
      objData: [],
      mapLayer: '影像',
      layer: []
    }
  },
  methods: {
    // drawOverLayers
    drawOverLayers () {
      if ($vue.map) {
        $vue.map.clearMap()
      }
      if ($vue.mapData.length > 0) {
        if ($vue.spaceType === 'point') {
          marker = new window.AMap.Marker({
            position: new window.AMap.LngLat($vue.mapData[0], $vue.mapData[1]),
            map: $vue.map
          })
          $vue.mapCenter = $vue.mapData
          $vue.map.setFitView(marker)
          marker.state = 'ready'
          marker.on('rightclick', (e) => {
            $vue.handleRightClick(e.target)
          })
          marker.on('dblclick', (e) => {
            $vue.handleDblClick(e.target)
          })
        } else if ($vue.spaceType === 'polyline') {
          $vue.mapData.forEach((item) => { //
            const path = []
            item.forEach((longlat) => {
              path.push(new window.AMap.LngLat(longlat[0], longlat[1]))
            })
            const polyline = new window.AMap.Polyline({
              path: path,
              // map: $vue.map,
              strokeWeight: 8,
              strokeColor: '#3366FF'
            })
            polyline.state = 'ready'
            $vue.map.add(polyline)
            $vue.map.setFitView([ polyline ])
            $vue.map.plugin(['AMap.PolyEditor'], function () {
              polyline.polyEditor = new window.AMap.PolyEditor($vue.map, polyline)
              polyline.on('rightclick', (e) => {
                $vue.infoWindow.position = [e.lnglat.lng, e.lnglat.lat]
                $vue.handleRightClick(e.target)
              })
              polyline.on('dblclick', (e) => {
                $vue.handleDblClick(e.target)
              })
            })
          })
        } else if ($vue.spaceType === 'polygon') {
          $vue.mapData.forEach((item, index) => {
            const path = []
            item.forEach((longlat) => {
              path.push(new window.AMap.LngLat(longlat[0], longlat[1]))
            })
            const polygon = new window.AMap.Polygon({
              path: path,
              map: $vue.map,
              fillColor: '#40a4fd',
              fillOpacity: 0.5,
              strokeColor: '#40a4fd'
            })
            polygon.state = 'ready'
            if ($vue.map) {
              $vue.map.plugin(['AMap.PolyEditor'], () => {
                polygon.polyEditor = new window.AMap.PolyEditor($vue.map, polygon)
                $vue.map.setFitView([ polygon ])
                polygon.on('rightclick', (e) => {
                  $vue.infoWindow.position = [e.lnglat.lng, e.lnglat.lat]
                  $vue.handleRightClick(e.target)
                })
                polygon.on('dblclick', (e) => {
                  $vue.handleDblClick(e.target)
                })
              })
            }
          })
        }
        $vue.objData = $vue.mapData
      }
    },
    // 搜索定位
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
            if (!marker) {
              marker = new window.AMap.Marker()
            }
            marker.setPosition(lnglat)
            $vue.map.setFitView(marker)
            geocoder.clear()
            this.searchComlate = false
          })
        }
      } else {
        this.searchComlate = false
      }
    },
    // 右键事件
    handleRightClick (obj) {
      if (!obj && $vue.map) {
        $vue.map.getAllOverlays(this.spaceType === 'point' ? 'marker' : this.spaceType).forEach(objItem => {
          $vue.handleRightClick(objItem)
        })
      } else if ($vue.map) {
        this.bindObj = obj
        if (this.operType !== 'view') {
          if (obj.state === 'ready') {
            // 展示删除
            if (this.spaceType === 'polyline' || this.spaceType === 'polygon') {
              this.infoWindow.position = [obj.getBounds().getCenter().lng, obj.getBounds().getCenter().lat]
            } else {
              this.infoWindow.position = [obj.getPosition().lng, obj.getPosition().lat]
            }
            this.infoWindow.visible = true
            // 判断删除位置
            obj.state = 'delete'
          } else if (obj.state === 'add') {
            obj.state = 'ready'
            // 退出新增
            $vue.mouseTool.close()
          } else if (obj.state === 'edit') {
            // 退出编辑
            if (this.spaceType === 'point') {
              obj.setDraggable(false)
            } else {
              obj.polyEditor.close()
            }
            obj.state = 'ready'
          } else if (obj.state === 'delete') {
            obj.state = 'ready'
          }
        } else {
          // 退出编辑
          if (this.spaceType === 'point') {
            obj.setDraggable(false)
          } else {
            obj.polyEditor.close()
          }
          obj.state = 'ready'
        }
      }
    },
    // 双击事件
    handleDblClick (obj) {
      if (this.operType !== 'view') {
        if (obj.state === 'ready') {
          obj.state = 'edit'
          // 进入编辑状态
          if (this.spaceType === 'point') {
            $vue.editPoint(obj)
          } else if (this.spaceType === 'polyline') {
            $vue.editPolyline(obj)
          } else if (this.spaceType === 'polygon') {
            $vue.editPolygon(obj)
          }
        } else if (obj.state === 'add') {
          obj.state = 'ready'
          $vue.mouseTool.close()
        }
      }
    },
    // handleDefaultTool
    handleDefaultTool () {
      if ($vue.operType === 'add') {
        if ($vue.spaceType === 'point') {
          $vue.drawPoint()
        } else if ($vue.spaceType === 'polyline') {
          $vue.drawPolyline()
        } else if ($vue.spaceType === 'polygon') {
          $vue.drawPolygon()
        }
      } else if ($vue.operType === 'edit' && $vue.map) {
        if ($vue.spaceType === 'point') {
          $vue.map.getAllOverlays('marker').forEach(obj => {
            $vue.editPoint(obj)
          })
        } else if ($vue.spaceType === 'polyline') {
          $vue.map.getAllOverlays('polyline').forEach(obj => {
            $vue.editPolyline(obj)
          })
        } else if ($vue.spaceType === 'polygon') {
          $vue.map.getAllOverlays('polygon').forEach(obj => {
            $vue.editPolygon(obj)
          })
        }
      } else {
        this.handleRightClick()
      }
    },
    // 切换地图图层
    changeMapLayer () {
      if (this.layer.length > 0) {
        this.layer.forEach((item, index) => {
          this.map.remove(item)
        })
        this.layer = []
      }
      if (this.mapLayer === '矢量') {
        this.mapLayer = '影像'
      } else {
        this.mapLayer = '矢量'
        this.layer.push(new window.AMap.TileLayer.Satellite())
        this.layer.push(new window.AMap.TileLayer({
          getTileUrl: 'http://218.67.246.252:83/imageMapServer/bigemap.dclrrys3/tiles/[z]/[x]/[y].png?access_token=pk.eyJ1IjoiY3VzXzc1cmJ5MjdwIiwiYSI6ImRlam5qeWZpbXJpd3VnZTRmYXJoeHNiejQiLCJ0IjoxfQ.hDFpINtoMCGJH6Sw2hhAt9VzqpKZ-vFAxmenzr08Ck4',
          zIndex: 100
        }))
        this.layer.forEach((item, index) => {
          this.map.add(item)
        })
      }
    }
  },
  mounted () {
    $vue = this
    if (this.$refs.pickerMap) {
      this.screenHeight = this.$refs.pickerMap.offsetHeight
    }
    window.addEventListener('resize', () => {
      if (this.$refs.pickerMap) {
        this.screenHeight = this.$refs.pickerMap.offsetHeight
      }
    })
  },
  watch: {
    objData (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    mouseTool () {
      this.mouseTool.off('draw').on('draw', (event) => {
        this.objData = []
        if ($vue.spaceType === 'polyline' || $vue.spaceType === 'polygon') {
          const bounds = []
          event.obj.getPath().forEach(line => {
            bounds.push([line.lng, line.lat])
          })
          this.objData.push(bounds)
          event.obj.state = 'add'
          $vue.map.plugin(['AMap.PolyEditor'], function () {
            event.obj.polyEditor = new window.AMap.PolyEditor($vue.map, event.obj)
          })
        } else {
          this.mouseTool.close()
          this.objData = [event.obj.getPosition().lng, event.obj.getPosition().lat]
        }
        event.obj.on('rightclick', (e) => {
          $vue.infoWindow.position = [e.lnglat.lng, e.lnglat.lat]
          if (!event.obj.state) {
            event.obj.state = 'ready'
          }
          $vue.handleRightClick(event.obj)
        })
        event.obj.on('dblclick', (e) => {
          event.obj.state = 'ready'
          $vue.handleDblClick(event.obj)
        })
      })
      // }
    },
    operType (val) {
      if (this.mouseTool) {
        this.mouseTool.close()
      }
      this.handleDefaultTool()
    },
    spaceType (val) {
      if (this.map) {
        this.map.clearMap()
      }
      this.objData = []
      this.handleDefaultTool()
    },
    mapData (val) {
      if (val !== this.objData) {
        if (this.mouseTool) {
          this.mouseTool.close()
        }
        if (this.map) {
          this.map.clearMap()
        }
        $vue.drawOverLayers()
        this.handleDefaultTool()
      }
    }
  },
  destroyed () {
    if (this.mouseTool) {
      this.mouseTool.close()
    }
  }
}
</script>
<style lang="less">
.eleMap.spacepicker{
  .map-search-content{
        position:absolute;
        top:20px;
        left:20px;
        box-shadow: 0 2px 2px rgba(0,0,0,.15);
        border-radius: 3px;
        width: 360px;
        .ant-btn{
          margin-left: -5px;
          border-radius: 0 4px 4px 0;
          vertical-align: top;
          border: 0;
          &::after{
            display:none;
          }
        }
        .ant-input-lg{
          border:0;
          box-shadow: unset;
        }
    }
  .map-right-action-content{
    padding:0;
    .ant-btn{
      padding:0 15px;
      &:hover{
        border-color: #2a82e4;
      }
    }
    .ant-btn:not(.active){
      color:rgba(0, 0, 0, 0.65);//#2a82e4;
    }
    .ant-btn:hover{
      color:#2a82e4;
      border-color: #2a82e4;
    }
  }
  .amap-info-content{
    background: none;
    border: 0;
    padding: 0;
    border-radius: 50%;
    overflow:hidden;
  }
  .amap-info-sharp{
    display:none;
  }
  .amap-info-close{
    position: absolute;
    top: -6px;
    right: -8px;
    width: 15px;
    height: 15px;
    font-size: 12px;
    background: #f08aae;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 15px;
    box-shadow: -1px 1px 1px rgba(10, 10, 10, .2);
    display:none;
  }
}
</style>
