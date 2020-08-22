export function localStorageSetItem (name, data) {
  console.log('尝试存储', name)
  try {
    console.log('开始存储', name)
    localStorage.setItem(name, JSON.stringify(data))
    console.log('存储完成', name)
  } catch (e) {
    console.groupCollapsed('%ctry失败：数据类型不合法！', 'color: red;')
    console.error(e)
    console.groupEnd()
  }
}
