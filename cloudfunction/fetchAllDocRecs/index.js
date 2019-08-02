const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

const MAX_LIMIT = 100

exports.main = async (event, context) => {
  // Get num of records
  const countResult = await db.collection(event.docName).count()
  const total = countResult.total
  // Count how many fetches we need
  const batchTimes = Math.ceil(total / 100)
  // Hold all data read
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(event.docName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // Wait for all tasks
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg
    }
  })

}