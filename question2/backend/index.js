
const express=require("express");
const app=express();
const PORT=4000;
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("hello affords");
});
app.listen(PORT,()=>{
    console.log(`App is listen at the port ${PORT}`);
});
