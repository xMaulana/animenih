const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://sleepin:mongodbUser@47.250.40.77:27017/";

const client = new MongoClient(uri, {useNewUrlParser: true})
const db = "sleepingowl";

module.exports = {
    connect: () => new Promise(async (resolve,reject) =>{
        try{
            await client.connect();
            resolve({status: "sukses", msg: "berhasil menghubungkan ke db"})
        }catch(err){
            reject({status: "error", msg: err.message})
        }
    }),
    getCol: (nama) =>{
        return client.db(db).collection(nama)
    }
}
