const { ObjectId } = require("mongodb")
const db = require("../db/dbconfig")
const col = db.getCol("akun")


module.exports = {
    createAcc: (usr, pwd, cookie) => new Promise(async (resolve, reject) =>{
        try{
            if((await col.find({username: usr}).toArray()).length >0){
                reject({status: false, err: "Username sudah ada!"})
            }else{
                await col.insertOne({username: usr, password: pwd, cookie})
                resolve({status: true})
            }
        }catch(err){
            reject({status: false, err: err.message})
        }
    }),
    login: (usr, pwd, cookie) => new Promise(async (resolve, reject) =>{
        try{
            let [has] = await col.find({username: usr, password: pwd}).toArray()
            console.log(has)
            if(!has.username){
                reject({status: false, err: "not found"})
            }else{
                await col.updateOne({_id: new ObjectId(has._id.toHexString())}, {$set: {cookie: cookie}} )
                resolve({status: true, data: has})
            }
        }catch(err){
            reject({status: false, err: err.message})
        }
    }),
    getAkunbyCookie: async (cookie) => {
        let has = await col.find({cookie: cookie}).toArray();
        if(has.length >0){
            return {status: true, has}
        }else{
            return {status: false}
        }
    }
}