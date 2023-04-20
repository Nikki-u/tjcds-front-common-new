import IconPicker from './Icon/IconPicker.vue'
import LocationPicker from './Location/LocationPicker.vue'
IconPicker.install = function (Vue) {
  Vue.component(IconPicker.name, IconPicker)
}
LocationPicker.install = function (Vue) {
  Vue.component(LocationPicker.name, LocationPicker)
}
export {
  IconPicker,
  LocationPicker
}
