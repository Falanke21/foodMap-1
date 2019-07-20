// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var that = this
  const _ = db.command
  
  try {
    return await db.collection('location').doc(event.update_id).update({
      data: {
        likes: _.inc(1)
      },
    })
    } catch(e) {
      console.error(e)
      }
  
}