export default {
  methods: {
    // 切换图层
    handleStatistic (item) {
      this.mouseTool = new window.AMap.MouseTool(this.map)
      this.curStatistic = [item.key]
      switch (item.key) {
        case '框选':
          // alert('框选')
          this.mouseTool.rectangle()
          break
        case '圆选':
          // alert('圆选')
          this.mouseTool.circle()
          break
        case '多边形选':
          // alert('多边形选')
          this.mouseTool.polygon()
          break
      }
      this.mouseTool.off('draw').on('draw', (event) => {
        this.staticModal = true
        this.mouseTool.close()
        this.staticLayer = event.obj
        const bounds = []
        this.map.getAllOverlays('marker').forEach((item, index) => {
          if (window.AMap.GeometryUtil.isPointInRing(item.getPosition(), event.obj.getPath())) {
            bounds.push(item.getExtData())
          }
        })
        this.$emit('resourceStatistic', bounds)
      })
    },
    handleOk () {
      if (this.staticLayer) {
        this.map.remove(this.staticLayer)
        this.staticLayer = null
        this.staticModal = false
        this.curStatistic = []
      }
    }
  }
}
