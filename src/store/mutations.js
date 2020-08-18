export default {
  // 题目加载好后进行处理，判断是否要更新等，并将处理好的数据存在vuex中
  TestDataOnload (state, TestData) {
    try { // 避免用户处于隐身模式或浏览器不支持localStorage
      const localTestData = JSON.parse(localStorage.题库) || []
      console.log(localTestData[0].title)
    } catch (e) {}
    state.TestData = TestData
  }
}
