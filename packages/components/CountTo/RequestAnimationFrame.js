let lastTime = 0
const prefixes = 'webkit moz ms o'.split(' ') // 各浏览器前缀
const TIME_T0_CALL = 16

let requestAnimationFrame = null
let cancelAnimationFrame = null

const isServer = typeof window === 'undefined'
if (isServer) {
  requestAnimationFrame = function () {
    console.error('server context not support')
  }
  cancelAnimationFrame = function () {
    console.error('server context not support')
  }
} else {
  requestAnimationFrame = window.requestAnimationFrame
  cancelAnimationFrame = window.cancelAnimationFrame
  let prefix = null
  // 通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
  for (let i = 0; i < prefixes.length; i++) {
    if (requestAnimationFrame && cancelAnimationFrame) {
      break
    }
    prefix = prefixes[i]
    requestAnimationFrame = requestAnimationFrame || window[`${prefix}RequestAnimationFrame`]
    cancelAnimationFrame = cancelAnimationFrame || window[`${prefix}CancelAnimationFrame`] || window[`${prefix}CancelRequestAnimationFrame`]
  }

  // 如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime()
      // 为了使setTimteout的尽可能的接近每秒60帧的效果
      const timeToCall = Math.max(0, TIME_T0_CALL - (currTime - lastTime))
      const id = window.setTimeout(() => {
        const temp = currTime + timeToCall
        callback(temp)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }

    cancelAnimationFrame = function (id) {
      window.clearTimeout(id)
    }
  }
}

export { requestAnimationFrame, cancelAnimationFrame }
