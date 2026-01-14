const express = require("express");

const router = express.Router();

router.get("/test" ,(req,res)=>{
    res.json({ message: "API working fine" })
})

router.get("/test2" ,(req,res)=>{
    res.json({
        message : "API test2 working fine"
    })
})
module.exports = router