// eslint-disable-next-line @typescript-eslint/no-var-requires
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://node:123@localhost:27017';

async function boostrap() {
  const client = new MongoClient(url);
  await client.connect();
  console.log('数据库已创建!');
  try {
    const database = client.db('insertDB');
    const haiku = database.collection('haiku');
    // create a document to insert
    const doc = {
      title: 'Record of a Shriveled Datum',
      content: 'No bytes, no problem. Just insert a document, in MongoDB',
    };
    const result = await haiku.insertOne(doc);
    console.log('🚀 ~ boostrap ~ result', result);
  } finally {
    await client.close();
  }
}
boostrap();
