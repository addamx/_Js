//1. async函数, await会返回Promise对象, 如果返回值本身不是Promise对象, 会用Promise.resolve()转化
//2. await自动执行后面对象的then方法

const fetch = require('node-fetch');


async function getZhihuColumn(id) {
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

/**
 * 抓取async函数中的错误代码;
 * 1. 创建新的async函数专门来获取改async可能产生的错误;
 * 2. try...catch
 * (可选)3. 在原来的async函数自定义Error
 */
const showColumnInto = async (id) => {
  try {
    const column = await getZhihuColumn(id);
    console.log(`NAME: ${column.name}`);
    console.log(`INTRO: ${column.intro}`);
  } catch (error) {
    console.error(error);
  }
}
// showColumnInto('feweekly123');




/**
 * async中的并行
 */

//(1)
const multiAsync1 = async () => {
  try {
    const feweekly = getZhihuColumn('feweekly');
    const dreawer = getZhihuColumn('dreawer');
    const feweekly_res = await feweekly;
    const dreawer_res = await dreawer;
    console.log(`feweekly_NAME: ${feweekly_res.name}`);
    console.log(`feweekly_INTRO: ${feweekly_res.intro}`);
    console.log(`dreawer_NAME: ${dreawer_res.name}`);
    console.log(`dreawer_INTRO: ${dreawer_res.intro}`);
  } catch (error) {
    console.error(error);
  }
}
// multiAsync1();


//(2)
const multiAsync2 = async () => {
  try {
    const [feweekly_res, dreawer_res] = await Promise.all([
      getZhihuColumn('feweekly'),
      getZhihuColumn('dreawer')
    ])
    console.log(`feweekly_NAME: ${feweekly_res.name}`);
    console.log(`feweekly_INTRO: ${feweekly_res.intro}`);
    console.log(`dreawer_NAME: ${dreawer_res.name}`);
    console.log(`dreawer_INTRO: ${dreawer_res.intro}`);
  } catch (error) {
    console.error(error);
  }
}
multiAsync2();