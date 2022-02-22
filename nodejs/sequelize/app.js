/**
 * Created by addams on 2017/4/29.
 */


//=============创建Sequelize对象======================
const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});


//=============创建模型pet, 告诉sequelize如何映射数据库表=============================
var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
}, {
    timestamps: false       //关闭Sequelize的自动添加timestamp的功能
});



//===============添加数据=======================
var now = Date.now();
//Promise写法
// Pet.create({
//     id: 'g-' + now,
//     name: 'Gaffey',
//     gender: false,
//     birth: '2007-07-07',
//     createdAt: now,
//     updatedAt: now,
//     version: 0
// }).then(function (p) {
//     console.log('created.' + JSON.stringify(p));
// }).catch(function (err) {
//     console.log('failed: ' + err);
// });

//await的写法
(async () => {
    var dog = await Pet.create({
    id: 'd-' + now,
    name: 'Gaffey',
    gender: false,
    birth: '2008-08-08',
    createdAt: now,
    updatedAt: now,
    version: 0
});
console.log('created: ' + JSON.stringify(dog));
})();


//================更新数据 save / 删除数据 destroy=================
(async () => {
    var pets = await Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
        console.log('update pet...');
        p.gender = true;
        p.updatedAt = Date.now();
        p.version ++;
        await p.save();
        if (p.version === 3) {
            await p.destroy();
            console.log(`${p.name} was destroyed.`);
        }
    }
})();














