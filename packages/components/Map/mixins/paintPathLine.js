export default {
  methods: {
    // 飞线
    paintPathLine () {
      if (this.flyNavList.length > 0) {
        this.flyNavList.forEach((item, index) => {
          item.navg.destroy()
          item.line.setData([])
        })
      }
      this.flyNavList = []
      if (this.flyLines && this.flyLines.length > 0) {
        this.flyLines.forEach(item => {
          window.AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier, $) => {
            if (!PathSimplifier.supportCanvas) {
              alert('当前环境不支持 Canvas！')
              return
            }
            var pathSimplifierIns = new PathSimplifier({
              zIndex: 100,
              autoSetFitView: true,
              clickToSelectPath: false,
              map: this.map, // 所属的地图实例

              getPath: function (pathData, pathIndex) {
                return pathData.path
              },
              getHoverTitle: function (pathData, pathIndex, pointIndex) {
                let str = ''
                Object.keys(pathData.name).forEach(item => {
                  str += '<p style="margin:0;">' + item + ': ' + pathData.name[item] + '</p>'
                })
                return str
              },
              renderOptions: {
                renderAllPointsIfNumberBelow: 100 // 绘制路线节点，如不需要可设置为-1
              }
            })
            // 设置数据
            pathSimplifierIns.setData([{
              name: item.desc,
              path: [
                item.startMarker.position, // [116.405289, 39.904987],
                item.endMarker.position // [87.61792, 43.793308]
              ],
              extra: item.data
            }])
            // 对第一条线路（即索引 0）创建一个巡航器
            // const img = require('../img/plan.png')
            var navg1 = pathSimplifierIns.createPathNavigator(0, {
              loop: true, // 循环播放
              speed: 10000, // 巡航速度，单位千米/小时
              pathNavigatorStyle: {
                width: 10,
                height: 10,
                content: 'defaultPathNavigator',
                pathLinePassedStyle: {
                  lineWidth: 2,
                  strokeStyle: item.lineColor ? item.lineColor : 'rgba(8, 126, 196, 1)',
                  borderWidth: 1,
                  borderStyle: '#eeeeee',
                  dirArrowStyle: false
                }
              }
            })
            pathSimplifierIns.on('pathClick', (evt, pathInfo) => {
              this.$emit('on-pathLine-click', pathInfo.pathData.extra)
            })
            this.flyNavList.push({ navg: navg1, line: pathSimplifierIns })
            navg1.start()
          })
        })
      }
    }
  }
}
