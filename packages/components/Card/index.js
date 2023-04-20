import CardFilter from './CardFilter/CardFilter.vue'
import CardList from './CardList/CardList.vue'
CardFilter.install = function (Vue) {
  Vue.component(CardFilter.name, CardFilter)
}
CardList.install = function (Vue) {
  Vue.component(CardList.name, CardList)
}
export {
  CardFilter,
  CardList
}
