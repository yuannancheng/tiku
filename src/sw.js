import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register('sw.js', {
    ready () {
      console.log(
        '应用程序正在由Service worker从缓存中提供。'
      )
    },
    registered () {
      console.log('Service worker 已注册。')
    },
    cached () {
      console.log('内容已缓存以供脱机使用。')
    },
    updatefound () {
      console.log('正在下载新内容。')
    },
    updated () {
      console.log('有新内容可用, 请刷新。')
      window.location.reload(true) // 这里需要刷新页面
    },
    offline () {
      console.log('找不到互联网连接。 应用正在离线模式下运行.')
    },
    error (error) {
      console.error('Service worker注册期间发生错误：', error)
    }
  })
}
