export default {
  methods: {
    drawPolygon () {
      if (this.mouseTool) {
        this.mouseTool.close()
        this.mouseTool.polygon({})
      }
    },
    editPolygon (obj) {
      obj.polyEditor.open()
      obj.polyEditor.on('end', (type, target) => {
        this.objData = []
        this.map.getAllOverlays(this.spaceType === 'point' ? 'marker' : this.spaceType).forEach((item, index) => {
          const bounds = []
          item.getPath().forEach(line => {
            bounds.push([line.lng, line.lat])
          })
          this.objData.push(bounds)
        })
      })
      obj.state = 'edit'
    }
  }
}
