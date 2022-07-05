const {MongoClient}=require("mongodb");
const dotenv=require("dotenv");
dotenv.config();
const client= new MongoClient(process.env.CONNECTIONSTRING);
//Database Connection 
async function start(){
    await client.connect();
    module.exports=client;
    const app= require('./app');
    app.listen(process.env.PORT,function(){
    console.log(`Server is running on port ${process.env.PORT}`);
})
}
start();
