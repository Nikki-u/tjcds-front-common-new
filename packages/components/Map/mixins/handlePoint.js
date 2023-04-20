export default {
  methods: {
    drawPoint () {
      if (this.mouseTool) {
        this.mouseTool.close()
      }
      if (this.map.getAllOverlays('marker').length === 0) {
        if (this.mouseTool) {
          this.mouseTool.marker({})
        }
      }
    },
    editPoint (obj) {
      obj.state = 'edit'
      obj.setDraggable(true)
      obj.on('dragging', (e) => {
        this.objData = []
        this.objData = [e.target.getPosition().lng, e.target.getPosition().lat]
      })
    }

  }
}
