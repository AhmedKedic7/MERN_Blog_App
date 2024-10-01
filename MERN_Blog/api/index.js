const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.js');
const Post = require('./models/post.js');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const username=process.env.DB_USERNAME;
const password=process.env.DB_PASSWORD;

const salt = bcrypt.genSaltSync(10);
const secret = 'somesecret';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(express.json());

app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.cb31j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

app.post('/register', async(req,res)=>{
    const {username,password}=req.body;
    try{
        const userDoc= await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    }catch(e){
        console.log(e);
        res.status(400).json(e);
    }
    
})

app.post('/login', async(req,res)=>{
    const {username,password}=req.body;
    const userDoc=await User.findOne({username});
    const pass = bcrypt.compareSync(password,userDoc.password);
    if(pass){
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
        });
    }else{
        res.status(400).json("Wrong creditentials!");
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            res.json(info);
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});


app.post("/logout", (req,res)=>{
    res.cookie('token','').json("ok");
})

app.post("/post",uploadMiddleware.single('file'), async (req,res)=>{
    const {originalname,path}= req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const imgPath=path+'.'+ext;
    fs.renameSync(path,imgPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async(err, info)=>{
        if(err) throw err;
        const {title,summary,content} = req.body;
        const postDoc=await Post.create({
        title,
        summary,
        content,
        cover:imgPath,
        author:info.id,
    });
       res.json(postDoc);
        
    });
    
})

app.get('/post', async (req,res)=>{
    res.json(await Post.find()
    .populate('author',['username']).sort({createdAt:-1}).limit(20));
})

app.get('/post/:id', async (req,res)=>{
    const {id} =req.params;
    const postDoc=await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

app.put('/post', uploadMiddleware.single('file'), async(req,res)=>{
    let imgPath=null;
    if(req.file){
        const {originalname,path}= req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        imgPath=path+'.'+ext;
        fs.renameSync(path,imgPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async(err, info)=>{
        if(err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc=await Post.findById(id);
        const isAuthor=JSON.stringify(postDoc.author)===JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json("You are not the author!")
        }
        await postDoc.updateOne({title,
            summary,
            content,
            cove:imgPath ? imgPath : postDoc.cover,
        });
       res.json(postDoc);
    });
    
})

app.listen(4000);
