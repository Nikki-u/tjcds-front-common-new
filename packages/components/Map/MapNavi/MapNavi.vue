<template>
  <section v-if="naviStatus" :id="naviStatus?'naviCont':''" >
    <div style="width:180px;margin:0 auto;">
      <a-radio-group :defaultValue="naviType" size="large" class="navi-type-radio" @change="changeNaviType">
        <a-radio-button value="car"><a-icon type="car" /></a-radio-button>
        <a-radio-button value="bus"><icon-font type="iconicon-" /></a-radio-button>
        <a-radio-button value="walk"><icon-font type="iconbuhang" /></a-radio-button>
      </a-radio-group>
    </div>
    <div style="position: relative;">
      <a-button style="background:none;border:0;position:absolute;top:30%;left:-15px;" @click="swapStartEnd"><icon-font type="iconic_swap_horiz_px" /></a-button>
      <div style="display:inline-block;margin-left:30px; margin-right:30px;">
        <a-input placeholder="请输入起点" v-model="startPoint" >
          <span slot="prefix" type="user" class="navi-button">起</span>
        </a-input>
        <div v-for="(item,index) in naviOtherList" v-if="naviType==='car'" :key="index" style="display:inline-block;position:relative;width: 100%;">
          <a-input placeholder="请手动输入途径点" v-model="item.keyword" >
            <span slot="prefix" type="user" class="navi-button">经</span>
          </a-input>
          <a-icon type="minus-circle" @click="removeNaviOtherPoint(index)" :style="{position:'absolute', right:'-30px', top:'8px'}"/>
        </div>
        <a-icon type="plus-circle" v-if="naviType==='car'" :style="{position:'absolute', right:'0px', top:(naviOtherList.length > 0 ? 'auto' : '30%'), bottom:(naviOtherList.length > 0 ? '15px' : 'auto')}" @click="addNaviOtherPoint"/>
        <a-input placeholder="请输入终点" v-model="endPoint" >
          <span slot="prefix" type="user" class="navi-button">终</span>
        </a-input>
      </div>
      <a-button @click="clearNavi" class="navi-setting" style="float:left;">清除导航</a-button>
      <a-button @click="go" class="navi-setting" style="float:right;">{{ naviType==="car"?"开车去":(naviType==="bus"?'公交去':'步行去') }}</a-button>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      naviType: 'car',
      startPoint: '',
      endPoint: '',
      naviStartEndList: [],
      transfer: '',
      walking: '',
      driving: '',
      geocoder: '',
      naviOtherList: [],
      mouseTool: ''
    }
  },
  props: {
    map: {
      type: Object,
      default: () => {
        return {}
      }
    },
    naviStatus: {
      type: Boolean,
      default: false
    },
    city: {
      type: Object,
      default: () => {
        return { code: '022', name: '天津市' }
      }
    }
  },
  methods: {
    // 切换导航类型
    changeNaviType (val) {
      this.naviType = val.target.value
      this.naviOtherList = []
      if (this.startPoint && this.endPoint) {
        this.go()
      }
    },
    addNaviOtherPoint () {
      this.naviOtherList.push({ keyword: '', city: this.city.name })
    },
    removeNaviOtherPoint (index) {
      this.naviOtherList.splice(index, 1)
    },
    clearNavi () {
      this.naviStartEndList.forEach(item => {
        this.map.remove(item.obj)
      })
      if (this.driving) {
        this.driving.clear()
      }
      if (this.transfer) {
        this.transfer.clear()
      }
      if (this.walking) {
        this.walking.clear()
      }
      this.startPoint = ''
      this.endPoint = ''
      this.naviStartEndList = []
      this.naviOtherList = []
    },
    go () {
      const self = this
      self.naviOtherList = self.naviOtherList.filter(item => {
        return item.keyword !== '' && item.keyword
      })
      if (this.driving) {
        this.driving.clear()
      }
      if (this.transfer) {
        this.transfer.clear()
      }
      if (this.walking) {
        this.walking.clear()
      }
      this.transfer = null
      this.walking = null
      this.driving = null
      if (!this.startPoint) {
        this.$message.error('请输入起点')
        return false
      }
      if (!this.endPoint) {
        this.$message.error('请输入终点')
        return false
      }
      this.driving = new window.AMap.Driving({
        map: this.map,
        panel: 'panel'
      })
      var transferOptions = {
        map: this.map,
        city: this.city.name,
        panel: 'panel',
        // cityd:'乌鲁木齐',//跨城进行公交路径规划时，目的地所在城市
        policy: window.AMap.TransferPolicy.LEAST_TIME // 乘车策略
      }
      this.transfer = new window.AMap.Transfer(transferOptions)
      this.walking = new window.AMap.Walking({
        map: this.map,
        panel: 'panel'
      })
      this.naviStartEndList.forEach(item => {
        this.map.remove(item.obj)
      })
      let lnglats = []
      lnglats.push({ keyword: this.startPoint, city: this.city.name })
      lnglats = lnglats.concat(this.naviOtherList)
      lnglats.push({ keyword: this.endPoint, city: this.city.name })
      if (this.naviType === 'car') {
        this.driving.search(lnglats, (status, result) => {
          // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
          if (status === 'complete') {
            this.$message.success('绘制驾车路线完成')
          } else {
            this.$message.error('获取驾车数据失败：无此线路')
          }
        })
      } else if (this.naviType === 'bus') {
        // 根据起、终点坐标查询公交换乘路线
        this.transfer.search(lnglats, (status, result) => {
          if (status === 'complete') {
            this.$message.success('绘制公交路线完成')
          } else {
            this.$message.error('公交路线数据查询失败：无此线路')
          }
        })
      } else {
        this.walking.search(lnglats, (status, result) => {
          if (status === 'complete') {
            this.$message.success('绘制步行路线完成')
          } else {
            this.$message.error('步行路线数据查询失败：无此线路')
          }
        })
      }
    },
    paintNaviPoint () {
      this.mouseTool = new window.AMap.MouseTool(this.map)
      this.mouseTool.marker()
      this.mouseTool.on('draw', (event) => {
        if (this.naviStartEndList.length < 1) {
          this.map.plugin(['AMap.Geocoder'], () => {
            this.geocoder = new window.AMap.Geocoder({
              city: this.map.getAdcode() // 城市设为北京，默认：“全国”
            })
            this.geocoder.getAddress(event.obj.getPosition(), (status, result) => {
              if (status === 'complete' && result.regeocode) {
                this.startPoint = result.regeocode.formattedAddress
                this.naviStartEndList.push({ obj: event.obj, type: 'startPoint' })
              } else {
                this.$message.error('根据经纬度查询地址失败')
              }
            })
          })
          // this.startPoint = this.changeGeocoder(event.obj.getPosition())
        } else if (this.naviStartEndList.length < 2) {
          this.map.plugin(['AMap.Geocoder'], () => {
            this.geocoder = new window.AMap.Geocoder({
              city: this.map.getAdcode() // 城市设为北京，默认：“全国”
            })
            this.geocoder.getAddress(event.obj.getPosition(), (status, result) => {
              if (status === 'complete' && result.regeocode) {
                if (this.startPoint === '') {
                  this.startPoint = result.regeocode.formattedAddress
                  this.naviStartEndList.push({ obj: event.obj, type: 'startPoint' })
                } else {
                  this.endPoint = result.regeocode.formattedAddress
                  this.naviStartEndList.push({ obj: event.obj, type: 'endPoint' })
                }
              } else {
                this.$message.error('根据经纬度查询地址失败')
              }
            })
          })
          this.mouseTool.close()
        }
      })
    },
    // 地理逆编码
    changeGeocoder (lnglat) {
      let address
      this.geocoder = new window.AMap.Geocoder({
        city: this.map.getAdcode() // 城市设为北京，默认：“全国”
      })
      this.geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.regeocode) {
          address = result.regeocode.formattedAddress
          return address
        } else {
          this.$message.error('根据经纬度查询地址失败')
        }
      })
    },
    swapStartEnd () {
      const start = this.startPoint
      const end = this.endPoint
      this.startPoint = end
      this.endPoint = start
    }
  },
  watch: {
    naviStatus (val, oldVal) {
      if (val) {
        this.paintNaviPoint()
      } else {
        this.clearNavi()
      }
    },
    naviStartEndList (val) {
      if (this.mouseTool) {
        this.mouseTool.close()
      }
      if (this.naviStatus) {
        if (val.length < 2) {
          this.paintNaviPoint()
        }
      }
    },
    startPoint (val) {
      if (val === '') {
        this.naviStartEndList.forEach((item, index) => {
          if (item.type === 'startPoint') {
            this.naviStartEndList.splice(index, 1)
            this.map.remove(item.obj)
          }
        })
      }
    },
    endPoint (val) {
      if (val === '') {
        this.naviStartEndList.forEach((item, index) => {
          if (item.type === 'endPoint') {
            this.naviStartEndList.splice(index, 1)
            this.map.remove(item.obj)
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
.navi-button{
  color:#fff;
}
#naviCont .ant-input-affix-wrapper .ant-input {
    background-color: #3587eb;
    border: 0;
    color: #E1F1FF;
    &::-webkit-input-placeholder{
      color: #E1F1FF;
    }
    &::-moz-placeholder {
      color: #E1F1FF;
    }
}
#naviCont .navi-setting{
  background-color: #559ffb;
  color: #fff;
  border: 0;
  margin:10px 0;
}
</style>
