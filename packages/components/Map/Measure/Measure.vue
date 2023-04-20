<template>
  <a-dropdown placement="bottomCenter" :class="curMeasure.length>0?'active':''" @visibleChange="handleMeasureVisible" :trigger="['click']">
    <a-button >
      <icon-font type="iconceliang" />
      <span v-if="screenWidth>1050">测量</span>
    </a-button>
    <a-menu slot="overlay" @click="handleMeasure" v-model="curMeasure">
      <a-menu-item key="location">
        <icon-font type="iconweizhi" />位置
      </a-menu-item>
      <a-menu-item key="rule">
        <icon-font type="iconchizi" />距离
      </a-menu-item>
      <a-menu-item key="measureArea">
        <icon-font type="iconmianjiceliang" />面积
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
<script>
export default {
  data () {
    return {
      curMeasure: [], // 当前测量工具
      mouseTool: null,
      lastType: ''
    }
  },
  props: {
    screenWidth: {
      type: Number,
      default: 0
    },
    map: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    handleMeasure (item) {
      if (this.mouseTool && this.curMeasure[0] === item.key) {
        this.mouseTool.close(true)
        this.curMeasure = []
        return false
      } else if (this.mouseTool) {
        this.mouseTool.close(true)
      }
      this.curMeasure.splice(0, this.curMeasure.length)
      this.curMeasure.push(item.key)
      const type = this.curMeasure[0]
      this.mouseTool = new window.AMap.MouseTool(this.map)
      this.draw(this.mouseTool, type)
    },
    draw (mouseTool, type) {
      switch (type) {
        case 'rule': {
          mouseTool.rule({
            startMarkerOptions: {// 可缺省
              icon: new window.AMap.Icon({
                size: new window.AMap.Size(19, 31), // 图标大小
                imageSize: new window.AMap.Size(19, 31),
                image: 'https://webapi.amap.com/theme/v1.3/markers/b/start.png'
              })
            },
            endMarkerOptions: {// 可缺省
              icon: new window.AMap.Icon({
                size: new window.AMap.Size(19, 31), // 图标大小
                imageSize: new window.AMap.Size(19, 31),
                image: 'https://webapi.amap.com/theme/v1.3/markers/b/end.png'
              }),
              offset: new window.AMap.Pixel(-9, -31)
            },
            midMarkerOptions: {// 可缺省
              icon: new window.AMap.Icon({
                size: new window.AMap.Size(19, 31), // 图标大小
                imageSize: new window.AMap.Size(19, 31),
                image: 'https://webapi.amap.com/theme/v1.3/markers/b/mid.png'
              }),
              offset: new window.AMap.Pixel(-9, -31)
            },
            lineOptions: {// 可缺省
              strokeStyle: 'solid',
              strokeColor: '#FF33FF',
              strokeOpacity: 1,
              strokeWeight: 2
            }
            // 同 RangingTool 的 自定义 设置，缺省为默认样式
          })
          break
        }
        case 'measureArea': {
          mouseTool.measureArea({
            strokeColor: '#80d8ff',
            fillColor: '#80d8ff',
            fillOpacity: 0.3
            // 同 Polygon 的 Option 设置
          })
          break
        }
        case 'location': {
          mouseTool.marker({
          })
          window.AMap.event.addListener(mouseTool, 'draw', function (e) { // 添加事件
            e.obj.setLabel(
              {
                offset: new window.AMap.Pixel(20, 20), // 设置文本标注偏移量
                content: e.obj.getPosition().lng + ',' + e.obj.getPosition().lat, // 设置文本标注内容
                direction: 'right' // 设置文本标注方位
              }
            )
          })
          //   marker.setTitle('我是marker的title')
          break
        }
      }
    },
    // 关闭测量组件
    handleMeasureVisible (visible) {
      if (!visible) {
        this.curMeasure.splice(0, this.curMeasure.length)
        if (this.mouseTool) {
          this.mouseTool.close(true)
        }
      }
    }
  }
}
</script>
