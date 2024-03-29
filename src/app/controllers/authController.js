const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth');


const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn:   86400,
    });
}

router.post('/register', async(req, res) => {
    const {email} = req.body;
    try{
        if(await User.findOne({email}))
        return res.status(400).send({error: "_User already exists_"});

        const user = await User.create(req.body);

        user.password = undefined; //para não retornar a senha

        return res.send({
            user, 
            token: generateToken({ id: user.id}),
        });
    } catch (err) {
        return res.status(400).send({error: 'Registration failed'});
    }
});

router.post('/authenticate', async (req, res) =>{ //rota de autenticação
    const {email, password } = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).send({error:'User not found '});

    if(!await bcryptjs.compare(password, user.password))
        return res.status(400).send({error:'Invalid password '});

    user.password = undefined;
    
        
    res.send({
        user,
        token: generateToken({ id: user.id}),
    });
});

module.exports = app => app.use('/auth', router);