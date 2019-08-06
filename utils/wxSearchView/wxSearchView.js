// /***
//  * // 定义数据格式
//  * "wxSearchData":{
//  *  configconfig:{
//  *    style: "wxSearchNormal"
//  *  },
//  *  view:{
//  *    hidden: true,
//  *    searchbarHeght: 20
//  *  }
//  *  hotKeys:[],//自定义热门搜索
//  *  his:[]//历史搜索关键字
//  *  value
//  * }
//  */

// 提示集合
var __tipKeys = [];
// 搜索回调函数 
var __searchFunction = null;
// 返回函数 
var __goBackFunction = null;
// 应用变量
var __that = null;


// 初始化函数
function init(that, hotKeys, tipKeys, searchFunction, goBackFunction) {

  __that = that;
  __tipKeys = tipKeys;
  __searchFunction = searchFunction;
  __goBackFunction = goBackFunction;

  var temData = {};
  var barHeight = 43;
  var view = {
    barHeight: barHeight
  }
  temData.hotKeys = hotKeys;
  // Search for passed in input
  wx.getSystemInfo({
    success: function (res) {
      var wHeight = res.windowHeight;
      view.seachHeight = wHeight - barHeight;
      temData.view = view;
      __that.setData({
        wxSearchData: temData
      });
    }
  });

  getHisKeys(__that);
}

// Search alternatives ranking algor
function rankschrRes(keyword, resArr) {
  var arr = resArr;
  // Calculate editDist for elements
  for (let i = 0; i < arr.length; i++) {
    let name_dist = editDist(arr[i].shopName, keyword);
    let type_dist = editDist(arr[i].type, keyword);
    if (name_dist < type_dist) {
      arr[i].num_editDist = name_dist;
    } else {
      arr[i].num_editDist = type_dist;
    }
    // arr[i].editDist = editDist(arr[i].type + arr[i].name, keyword);
  }
  arr.sort(comparator)
  __that.setData({
    rankedRes: arr
  })
}

// Compare two locations' edit distance
function comparator(a, b) {
  return a.num_editDist - b.num_editDist
}

// Edit distance between two string, case senseless
function editDist(word1, word2) {
  let dp = new Array(2);
  dp = dp.fill().map(() => (new Array(word1.length + 1)));
  dp[0][0] = 0;

  for (let i = 1; i < dp[0].length; i++) {
    dp[0][i] = dp[0][i - 1] + 1;
  }

  for (let i = 1; i < word2.length + 1; i++) {
    for (let j = 0; j < dp[0].length; j++) {
      if (j === 0) {
        dp[i % 2][j] = dp[(i - 1) % 2][j] + 1;
        continue;
      }
      dp[i % 2][j] = Math.min(dp[(i - 1) % 2][j], dp[(i - 1) % 2][j - 1], dp[i % 2][j - 1]) + 1;
      if (word2[i - 1] === word1[j - 1]) dp[i % 2][j] = dp[(i - 1) % 2][j - 1];
    }
  }

  return dp[word2.length % 2][word1.length];
}

// 搜索框输入时候操作
function wxSearchInput(e) {
  var inputValue = e.detail.value.toLowerCase().trim();
  // 页面数据
  var temData = __that.data.wxSearchData;
  // 寻找提示值 
  var tipKeys = [];
  if (inputValue && inputValue.length > 0) {
    var chs_tags = __that.data.chs_tags
    var eng_tags = __that.data.eng_tags
    // If inputValue is a tag in Chinese, filter the results
    if (chs_tags.includes(inputValue)) {
      __that.setData({
        rankingRes: __that.data.schrRes.filter(function(item) {
            return item.chs_tag.includes(inputValue)
        })
      })
    // If inputValue is a tag in English, filter the results
    } else if (eng_tags.includes(inputValue)) {
      __that.setData({
        rankingRes: __that.data.schrRes.filter(function (item) {
          return item.eng_tag.includes(inputValue)
        })
      })
    // inputValue is not a tag
    } else {
      __that.setData({
        rankingRes: __that.data.schrRes
      })
    }
    // rank the results
    rankschrRes(inputValue, __that.data.rankingRes)
    // 显示搜索备选
    __that.setData({
      hiddenSchrRes: false
    });
    for (var i = 0; i < __tipKeys.length; i++) {
      var mindKey = __tipKeys[i];
      // 包含字符串
      if (mindKey.indexOf(inputValue) != -1) {
        tipKeys.push(mindKey);
      }
    }
  } else {
    // 隐藏搜索备选
    __that.setData({
      hiddenSchrRes: true
    });
  }
  // 更新数据
  temData.value = e.detail.value;
  temData.tipKeys = tipKeys;
  // 更新视图
  __that.setData({
    wxSearchData: temData
  });
}

// 清空输入
function wxSearchClear() {
  // 页面数据
  var temData = __that.data.wxSearchData;
  // 更新数据
  temData.value = "";
  temData.tipKeys = [];
  // 更新视图
  __that.setData({
    wxSearchData: temData
  });
}

// 点击提示或者关键字、历史记录时的操作
function wxSearchKeyTap(e) {
  var inputValue = e.target.dataset.key;
  if (inputValue && inputValue.length > 0) {
    // 添加历史记录
    wxSearchAddHisKey(inputValue);
    // 更新
    var temData = __that.data.wxSearchData;
    temData.value = inputValue;
    __that.setData({
      wxSearchData: temData
    });
  }
  // search(e.target.dataset.key);
}

// 确任或者回车
function wxSearchConfirm(e) {
  var key = e.target.dataset.key;
  if(key=='back'){
    __goBackFunction();
  }else{
    search(__that.data.wxSearchData.value);
  }
}

function search(inputValue) {
  if (inputValue && inputValue.length > 0) {
    // 添加历史记录
    wxSearchAddHisKey(inputValue);
    // 更新
    var temData = __that.data.wxSearchData;
    temData.value = inputValue;
    __that.setData({
      wxSearchData: temData
    });
    // 回调搜索
    __searchFunction(inputValue);
  }
}

// 读取缓存
function getHisKeys() {
  var value = [];
  try {
    value = wx.getStorageSync('wxSearchHisKeys')
    if (value) {
      // Do something with return value
      var temData = __that.data.wxSearchData;
      temData.his = value;
      __that.setData({
        wxSearchData: temData
      });
    }
  } catch (e) {
    // Do something when catch error
  }
}

// 添加缓存
function wxSearchAddHisKey(inputValue) {
  if (!inputValue || inputValue.length == 0) {
    return;
  }
  var value = wx.getStorageSync('wxSearchHisKeys');
  if (value) {
    if (value.indexOf(inputValue) < 0) {
      value.unshift(inputValue);
    }
    wx.setStorage({
      key: "wxSearchHisKeys",
      data: value,
      success: function () {
        getHisKeys(__that);
      }
    })
  } else {
    value = [];
    value.push(inputValue);
    wx.setStorage({
      key: "wxSearchHisKeys",
      data: value,
      success: function () {
        getHisKeys(__that);
      }
    })
  }
}

// 删除缓存
function wxSearchDeleteAll() {
  wx.removeStorage({
    key: 'wxSearchHisKeys',
    success: function (res) {
      var value = [];
      var temData = __that.data.wxSearchData;
      temData.his = value;
      __that.setData({
        wxSearchData: temData
      });
    }
  })
}

// 导出接口
module.exports = {
  init: init, //初始化函数
  wxSearchInput: wxSearchInput,// 输入变化时的操作
  wxSearchKeyTap: wxSearchKeyTap, // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: wxSearchConfirm, // 搜索函数
  wxSearchClear: wxSearchClear,  // 清空函数
}