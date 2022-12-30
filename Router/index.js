const express = require('express');
const {addclass,adding} = require('../Controler/addclass');
const router = express.Router();

router.get("/",addclass);
router.post("/add",adding);

module.exports= router;