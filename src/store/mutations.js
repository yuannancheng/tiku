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
    // state.UserData = {
    //   ...state.UserData,
    //   [id]: {
    //     'lastIndex': 0,
    //     'data': {}
    //   }
    // }
  },
  changeTest (state, kv) {
    console.log('开始更新')
    // if (kv[0] in )
    state.UserData[kv[0]].lastIndex = kv[1]
  }
}
