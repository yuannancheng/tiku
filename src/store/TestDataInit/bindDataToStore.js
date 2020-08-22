// 在store中直接读取了，不需要再另外读取
// export function bindDataToStore (state) {
//   // =====读取新版本中做题数据和笔记===============
//   var UserData = {}
//   var UserNote = {}
//   try { // 避免用户处于隐身模式或浏览器不支持localStorage或者本地存储的数据非法
//     UserData = typeof JSON.parse(localStorage.UserData) === 'object' ? JSON.parse(localStorage.UserData) : {}
//   } catch (e) {
//     console.groupCollapsed('%ctry失败：本地数据无法正确读取！', 'color: red;')
//     console.error(e)
//     console.groupEnd()
//   }
//   try { // 避免用户处于隐身模式或浏览器不支持localStorage或者本地存储的数据非法
//     UserNote = typeof JSON.parse(localStorage.UserNote) === 'object' ? JSON.parse(localStorage.UserNote) : {}
//   } catch (e) {
//     console.groupCollapsed('%ctry失败：本地数据无法正确读取！', 'color: red;')
//     console.error(e)
//     console.groupEnd()
//   }
//   state.UserData = UserData
//   state.UserNote = UserNote
// }
