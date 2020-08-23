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
        if (
          'user-select' in el1 &&
          (
            !(id in state.UserData) ||
            !('data' in state.UserData[id]) ||
            !(id1 in state.UserData[id].data) ||
            !('user-select' in state.UserData[id].data[id1])
          )
        ) {
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
        if (
          'user-note' in el1 &&
          (
            !(id in state.UserData) ||
            !('data' in state.UserData[id]) ||
            !(id1 in state.UserData[id].data) ||
            !('user-note' in state.UserData[id].data[id1])
          )
        ) {
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
    try {
      oldUserData = typeof JSON.parse(localStorage.UserData) === 'object' ? JSON.parse(localStorage.UserData) : {}
      oldUserNote = typeof JSON.parse(localStorage.UserNote) === 'object' ? JSON.parse(localStorage.UserNote) : {}
    } catch (e) {}

    oldData.forEach((e) => {
      if (JSON.stringify(e) !== '{}' && !([e.key] in oldUserData)) {
        oldUserData[e.key] = e.data
      }
    })
    oldNote.forEach((e) => {
      // 如果新版本下有数据，则把新版本数据拷贝过来，否则迁移到新版本
      if (JSON.stringify(e) !== '{}' && !([e.key] in oldUserNote)) {
        oldUserNote[e.key] = e.data
      }
    })
    if (JSON.stringify(oldUserData) !== JSON.stringify(state.UserData)) {
      state.UserData = oldUserData
    }
    if (JSON.stringify(oldUserNote) !== JSON.stringify(state.UserNote)) {
      state.UserNote = oldUserNote
    }
    // 做完版本迁移之后把旧的数据清除，在新版本稳定之前严禁做此操作！！！
    // localStorage.removeItem('题库')
  }
}
