export function toNewVersion (state) {
  // =====从旧版迁移数据===============
  var oldVersionProgramData = null
  try {
    oldVersionProgramData = typeof JSON.parse(localStorage.题库) === 'object' ? JSON.parse(localStorage.题库) : null
  } catch (e) {
    console.groupCollapsed('%ctry失败：数据类型不合法！', 'color: red;')
    console.error(e)
    console.groupEnd()
  }
  if (oldVersionProgramData != null) {
    var oldData = []
    var oldNote = []
    oldVersionProgramData.forEach((el, id) => {
      el.data.forEach((el1, id1) => {
        if ('user-select' in el1) {
          oldData.push({})
          if (!('key' in oldData[id])) {
            oldData[id].key = id
            oldData[id].data = {}
            oldData[id].data.lastIndex = el.lastIndex
            oldData[id].data.data = {}
          }
          oldData[id].data.data[id1] = {
            'userSelect': el1['user-select'],
            'fraction': el1['fraction']
          }
        }
        if ('user-note' in el1) {
          oldNote.push({})
          if (!('key' in oldNote[id])) {
            oldNote[id].key = id
            oldNote[id].data = {}
          }
          oldNote[id].data[id1] = el1['user-note']
        }
      })
    })
    // 因为store不能直接修改其中一项，所以用oldUserData直接替换引用
    var oldUserData = {}
    var oldUserNote = {}
    oldData.forEach((e) => {
      if (!([e.key] in state.UserData)) {
        oldUserData[e.key] = e.data
      } else {
        oldUserData[e.key] = state.UserData[e.key]
      }
    })
    oldNote.forEach((e) => {
      // 如果新版本下有数据，则把新版本数据拷贝过来，否则迁移到新版本
      if (!([e.key] in state.UserNote)) {
        oldUserNote[e.key] = e.data
      } else {
        oldUserNote[e.key] = state.UserNote[e.key]
      }
    })
    state.UserData = oldUserData
    state.UserNote = oldUserNote
    // 做完版本迁移之后把旧的数据清除，在新版本稳定之前严禁做此操作！！！
    // localStorage.removeItem('题库')
  }
}
