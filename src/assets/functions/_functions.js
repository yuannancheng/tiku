export default {
  vibrate,
  IsPC,
  CallQQ,
  formatTime,
  timeDifference
}

function vibrate (time) {
  time = typeof time === 'object' ? time : [100]
  if ('vibrate' in window.navigator) {
    window.navigator.vibrate(time) // 震动
    // window.navigator.vibrate([200, 100, 200]) // 震动200停100再震动200，和qq的消息震动一样
  } else {
    console.log('浏览器不支持震动')
  }
}

function IsPC () {
  return !(/Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent))
}

function CallQQ (number) {
  if (typeof number !== 'number') return
  if (this.IsPC()) {
    window.location.href = 'tencent://message/?uin=' + number
  } else {
    window.location.href = 'mqqwpa://im/chat?chat_type=wpa&uin=' + number + '&version=1&src_type=web&web_src=lvlingseeds.com'
  }
}

function formatTime (time) {
  if (typeof (time * 1) === 'number') {
    time = new Date(time)
  } else {
    time = new Date(Date.parse(time))
  }
  const _ft = {
    'Y': time.getFullYear(), // 年
    'M': time.getMonth() + 1, // 月
    'd': time.getDate(), // 日
    'h': time.getHours(), // 时
    'm': time.getMinutes(), // 分
    's': time.getSeconds() // 秒
  }
  _ft['M'] = _ft['M'] < 0 && _ft['M'] < 10 ? '0' + _ft['M'] : _ft['M']
  _ft['d'] = _ft['d'] < 0 && _ft['d'] < 10 ? '0' + _ft['d'] : _ft['d']
  _ft['h'] = _ft['h'] < 10 ? '0' + _ft['h'] : _ft['h']
  _ft['m'] = _ft['m'] < 10 ? '0' + _ft['m'] : _ft['m']

  return _ft['Y'] + '/' + _ft['M'] + '/' + _ft['d'] + ' ' + _ft['h'] + ':' + _ft['m']
}

function timeDifference (time) {
  let H, M, S
  H = Math.floor(time / 3600000)
  if (H < 10) H = '0' + H
  if (H > 0) time %= 3600000
  M = Math.floor(time / 60000)
  if (M < 10) M = '0' + M
  if (M > 0) time %= 60000
  S = parseInt(time / 1000)
  if (S < 10) S = '0' + S

  return H + ':' + M + ':' + S
}
