export function localStorageSetItem (name, data) {
  try {
    localStorage.setItem(name, JSON.stringify(data))
    console.log('监听到' + name + '发生变化，存储完成')
  } catch (e) {
    console.groupCollapsed('%ctry失败：数据类型不合法！', 'color: red;')
    console.error(e)
    console.groupEnd()
  }
}
