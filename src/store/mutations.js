import { toNewVersion } from './TestDataInit/toNewVersion'
import { upData } from './TestDataInit/upData'
export default {
  // 题目加载好后进行处理，判断是否要更新等，并将处理好的数据存在vuex中
  TestDataOnload (state, TestData) {
    // =====读取新版本中做题数据和笔记===============
    // bindDataToStore(state)

    // =====从旧版本迁移数据===============
    // 应该在 state.UserData 和 state.UserNote 初始化之后进行
    toNewVersion(state)

    // =====将本地数据与线上数据进行对比并更新
    upData(state, TestData)
  },
  // 显示/隐藏题库删除按钮
  changeShowDeleteBtn (state, value) {
    state.showDeleteBtn = value
  },
  // 删除题库
  deleteTestData (state, id) {
    state.TestData.splice(id, 1)
  },
  // 导入题库
  importTestData (state, value) {
    state.TestData.push(value)
  },
  // 初始化做题数据（第一次做某题库）
  initUserData (state, id) {
    state.UserData[id] = {
      'lastIndex': 0,
      'data': {}
    }
    // 触发更新
    state.UserData = Object.assign({}, state.UserData)
  },
  setTestLastIndex (state, kv) {
    state.UserData[kv[0]].lastIndex = kv[1]
    state.UserData = Object.assign({}, state.UserData)

    /* 因无法监视对象部分值的修改，使用以下方法来触发
     * 1、使用新的引用替换原引用
     *  state.UserData.key.changekey = changeValue
     *  state.UserData = Object.assign({}, state.UserData)
     * 2、往对象中新增子属性来触发
     *  state.UserData.key.changekey = changeValue
     *  state.UserData = {
     *    ...state.UserData,
     *    __TriggerWatch__: 0
     *  }
     *  delete state.UserData.__TriggerWatch__
    */
  },
  setOptionSelect (state, data) {
    const tid = data[0] // 题库id
    const lid = data[1] // 题号
    const opt = data[2] // 选项
    const fra = data[3] // 分数
    if (!(lid in state.UserData[tid].data)) {
      state.UserData[tid].data[lid] = {
        'userSelect': [],
        'fraction': 0
      }
    }
    state.UserData[tid].data[lid].userSelect = opt
    state.UserData[tid].data[lid].fraction = fra
    state.UserData = Object.assign({}, state.UserData)
  },
  setUserNote (state, data) {
    const tid = data[0] // 题库id
    const lid = data[1] // 题号
    const val = data[2] // 笔记内容
    if (!(tid in state.UserNote)) state.UserNote[tid] = {}
    state.UserNote[tid][lid] = val
    if (val === '') delete state.UserNote[tid][lid]
    state.UserNote = Object.assign({}, state.UserNote)
  },
  redoOfTheTest (state, id) {
    if (id in state.UserData) {
      state.UserData[id] = {
        'lastIndex': 0,
        'data': {}
      }
      state.UserData = Object.assign({}, state.UserData)
    }
  },
  createRandomData (state, Test) {
    const createTime = new Date().getTime()
    const duration = 0
    const initData = {
      'create': createTime,
      'duration': duration,
      'data': {
        'Test': Test,
        'record': {}
      }
    }
    if (!('Random' in state.UserData)) state.UserData.Random = []
    state.UserData.Random.push(initData)
    state.UserData = Object.assign({}, state.UserData)
    console.log('初始化随机数据完成')
  },
  setRandomData (state, data) {
    // const TestDataId = data[0]
    // const index = data[1]
  }
}
