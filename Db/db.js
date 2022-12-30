const { createPool } = require('mysql')

// const poolb = createPool({
//     host:"localhost",
//     user:"root",
//     password:"sfjfjsllsfsflc&(*&(*)*&&)*&*(/&/*hdhdk5i584847,shdhDhdh",
//     database:"app"
// });



const poolb = createPool({
    host:"localhost",
    user:"root",
    password:'',
    database:"class"
});

function pool(argument) {
    // body...
    return new Promise ((resolved, reject)=>{
        poolb.query(argument,(e,r)=>{
            if(e){
                return reject(e);
            }
   
            return resolved(r);
        });
    });
    
    
    
}
module.exports= pool;