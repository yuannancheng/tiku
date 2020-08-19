export function localStorageSetItem (name, data) {
  try {
    localStorage.setItem(name, JSON.stringify(data))
  } catch (e) {
    console.groupCollapsed('%ctry失败：数据类型不合法！', 'color: red;')
    console.error(e)
    console.groupEnd()
  }
}
