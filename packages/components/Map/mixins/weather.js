export default {
  methods: {
    // 切换天气
    handleWeather () {
      this.weatherStatus = !this.weatherStatus
      this.$emit('on-weather-click', this.weatherStatus)
    }
  }
}
