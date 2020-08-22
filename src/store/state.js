let TestData = []
let UserData = {}
let UserNote = {}
try {
  TestData = typeof JSON.parse(localStorage.TestData) === 'object' ? JSON.parse(localStorage.TestData) : {}
  UserData = typeof JSON.parse(localStorage.UserData) === 'object' ? JSON.parse(localStorage.UserData) : {}
  UserNote = typeof JSON.parse(localStorage.UserNote) === 'object' ? JSON.parse(localStorage.UserNote) : {}
} catch (e) {}

export default {
  TestData,
  UserNote,
  UserData,
  showDeleteBtn: false
}
/*
UserNote结构：
{
  0: {
    0: "第一个题库第一题的笔记",
    1: "第一个题库第二题的笔记"
  },
  1: {
    0: "第二个题库第一题的笔记",
    1: "第二个题库第二题的笔记"
  }
}

UserData结构：
{
  0: { // 第一个题库
    "lastIndex": 146, // 上次做在第147题
    data: {
      0: {
        "userSelect": "错" // 上次用户选择的答案是"错"
        "fraction": 1 // 得分
      },
      99: {
        "userSelect": "A" // 上次用户选择的答案是"A"
        "fraction": 1 // 得分
      },
      146: {
        "userSelect": ["A", "B"] // 上次用户选择的答案是"A、B"
        "fraction": 0.45 // 得分
      }
    }
  },
  1: { // 第二个题库
    "lastIndex": 0, // 上次做在第1题
    data: {
      0: {
        "userSelect": "对" // 上次用户选择的答案是"错"
        "fraction": 1 // 得分
      },
      99: {
        "userSelect": "A" // 上次用户选择的答案是"A"
        "fraction": 1 // 得分
      },
      146: {
        "userSelect": ["A", "B"] // 上次用户选择的答案是"A、B"
        "fraction": 0.45 // 得分
      }
    }
  }
}
*/
