export default {
  methods: {
    // 切换图层
    handleLayer (item) {
      if (this.layer) {
        this.map.remove(this.layer)
        this.layer = null
      }
      if (this.curLayers[0] === '三维') {
        this.map.destroy()
        this.map = new window.AMap.Map('amap', {
          viewMode: '2D'
        })
        // 添加 3D 罗盘控制
        this.map.addControl(new window.AMap.ControlBar(
          { position: { right: '20px', bottom: '20px' } }
        ))
        this.mapZoom = 10
        this.map.setZoom(this.mapZoom)
      }
      this.curLayers = [item.key]
      switch (item.key) {
        case '卫星':
          this.layer = new window.AMap.TileLayer.Satellite()
          break
        case '海图':
          this.layer = new window.AMap.TileLayer({
            getTileUrl: 'http://218.67.246.252:83/mapServer/tile/[z]/[y]/[x]?apikey=dbd677bc-9b95-42d9-a6c4-e878b13be1bb',
            zIndex: 100
          })
          break
        case '三维':
          this.map = new window.AMap.Map('amap', {
            viewMode: '3D',
            pitch: 55
          })
          this.mapCenter = [121.499809, 31.239666]
          // 添加 3D 罗盘控制
          this.map.addControl(new window.AMap.ControlBar(
            { position: { right: '20px', bottom: '20px' } }
          ))
          this.map.on('complete', () => {
            // 添加 Object3DLayer 图层，用于添加 3DObject 对象
            var object3Dlayer = new window.AMap.Object3DLayer()
            this.map.add(object3Dlayer)
            // 加载AMap.GltfLoader插件
            this.map.plugin(['AMap.GltfLoader'], function () {
              var option = {
                position: new window.AMap.LngLat(121.499809, 31.239666),
                scale: 1000,
                height: 0,
                scene: 0
              }
              var gltf = new window.AMap.GltfLoader()// require('../测试_lbs_d6eeb26726fb8b7672e5998d13625ed6.gltf')
              const url = 'map/3dfile/3dfile.gltf'
              gltf.load(url, function (gltfObj) {
                gltfObj.setOption(option)
                object3Dlayer.add(gltfObj)
              })
              // var urlCity = 'https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf'
              // var urlDuck = 'https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf'
              // var paramCity = {
              //     position: new window.AMap.LngLat(121.510909, 31.233366), // 必须
              //     scale: 3580, // 非必须，默认1
              //     height: 1800, // 非必须，默认0
              //     scene: 0 // 非必须，默认0
              // }

              // var paramDuck = {
              //     position: new window.AMap.LngLat(121.495000, 31.233366), // 必须
              //     scale: 800, // 非必须，默认1
              //     height: -100, // 非必须，默认0
              //     scene: 0 // 非必须，默认0
              // }

              // var gltfObj = new window.AMap.GltfLoader()

              // gltfObj.load(urlCity, function (gltfCity) {
              //     gltfCity.setOption(paramCity)
              //     gltfCity.rotateX(90)
              //     gltfCity.rotateZ(120)
              //     object3Dlayer.add(gltfCity)
              // })

              // gltfObj.load(urlDuck, function (gltfDuck) {
              //     gltfDuck.setOption(paramDuck)
              //     gltfDuck.rotateX(90)
              //     gltfDuck.rotateZ(-20)
              //     object3Dlayer.add(gltfDuck)
              // })
            })
          })
          break
        case '矢量':
          this.layer = new window.AMap.TileLayer()
          this.map.setMapStyle('amap://styles/ba9dc3bd0fdf3b9dae118c289a46f7e8')
          break
      }
      if (this.layer) {
        this.map.add(this.layer)
      }
      this.$emit('on-layer-change', item.key, this.mapZoom)
    }
  }
}
