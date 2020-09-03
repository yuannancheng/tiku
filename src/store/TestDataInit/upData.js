export function upData (state, TestData) {
  var localTestData = state.TestData

  // 得到默认数据列表，用于稍后和本地数据做对比
  var TestDataList = []
  TestData.forEach((e) => {
    TestDataList.push(e['defaultData'])
  })

  // 遍历本地已有题库，检查更新或存储新题库
  var updata = []
  localTestData.forEach((e, i) => {
    var thisDefaultDataIndex = e['defaultData']
    if (TestDataList.indexOf(thisDefaultDataIndex) !== -1) {
      // 如果本地有这个题库就从列表中删掉，否则稍后遍历列表将其添加到本地
      TestDataList.splice(TestDataList.indexOf(thisDefaultDataIndex), 1)

      // 检查更新
      if (!('version' in e) || e['version'] < TestData[thisDefaultDataIndex]['version']) {
        e['data'].forEach((e1, i1) => {
          var newTestData = TestData[thisDefaultDataIndex]['data'][i1]
          // 判断题目、正确答案、选项、题型等信息有无改变，无则跳过。即进行增量更新。
          if (
            e1['title'] !== newTestData['title'] ||
            e1['正确答案'].join(',') !== newTestData['正确答案'].join(',') ||
            e1['选项'].join(',') !== newTestData['选项'].join(',') ||
            e1['题型'] !== newTestData['题型']
          ) {
            // 当前题号有更新
            localTestData[i]['data'][i1] = newTestData

            // 将更新过的题号存起来
            if (!(thisDefaultDataIndex in updata)) {
              updata[thisDefaultDataIndex] = [i1 + 1]
            } else {
              updata[thisDefaultDataIndex].push(i1 + 1)
            }
          }
        })
        // 只要版本号更高，不论内容是否改变都给题库名称重新赋值
        localTestData[i]['title'] = TestData[thisDefaultDataIndex]['title']
        localTestData[i]['class'] = TestData[thisDefaultDataIndex]['class']
        localTestData[i]['version'] = TestData[thisDefaultDataIndex]['version']

        // 如果有新增题目，从新增的那题开始到结束肯定都被重置为新的数据，此处则需要补齐后面的数据
        for (var flag = e['data'].length; flag < TestData[thisDefaultDataIndex]['data'].length; flag++) {
          localTestData[i]['data'][flag] = TestData[thisDefaultDataIndex]['data'][flag]
        }
      }
    }
  })

  // 把新增加的题库插入到原有题库的队列中
  TestDataList.forEach((e) => {
    localTestData.splice(e, 0, TestData[e])
  })

  // 检查更新完毕，存储到store中，App.vue会监听到改变并自动存储到本地
  if (state.TestData !== localTestData) {
    state.TestData = localTestData
  }

  // 提醒用户哪些题目更新了，并且清除更新题号的用户做题数据
  var UserData = state.UserData
  if (updata.length > 0) {
    var str = ''
    for (var key in updata) {
      str += '\'' + TestData[key]['title'] + '\' 的以下题目已经更新：\n'
      str += updata[key].join('、')
      str += '\n'

      updata[key].forEach((e) => {
        delete UserData[key].data[e]
      })
    }
    str += '\n以上题目答题记录已重置，不影响其他题目。'

    // 将更改后的UseData存储到store中，App.vue会监听到改变并自动存储到本地
    state.TestData = TestData

    // alert(str)
    // 不是重大更新就后台静默更新，不提醒用户
    console.log(str)
  }
}
