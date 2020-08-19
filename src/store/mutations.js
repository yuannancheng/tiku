import { bindDataToStore } from './TestDataInit/bindDataToStore'
import { toNewVersion } from './TestDataInit/toNewVersion'
import { upData } from './TestDataInit/upData'
export default {
  // 题目加载好后进行处理，判断是否要更新等，并将处理好的数据存在vuex中
  TestDataOnload (state, TestData) {
    // =====读取新版本中做题数据和笔记===============
    bindDataToStore(state)

    // =====从旧版本迁移数据===============
    // 应该在 state.UserData 和 state.UserNote 初始化之后进行
    toNewVersion(state)

    // =====将本地数据与线上数据进行对比并更新
    upData(state, TestData)
    // =====读取本地题库数据===============
  }
}
