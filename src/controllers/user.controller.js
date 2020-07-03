const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const jwt = require('../services/jwt')
const ExpiredToken = require ('jwt-simple-error-identify').ExpiredToken;

const signUp = async (args) =>{
    const user = User();

    try{
        let userExists = await User.findOne({
            $or: [{email: args[1]}, {username: args[2]}]
        });
        if(userExists){
            return {message: "El usuario ya existe"};
        }else{
            user.name = args[0];
            user.email = args[1];
            user.username = args[2];
            const password = await generatePassword(args[3]);
            if(!password){
                return {message: "Error al crear la contraseña"};

            }else{
                user.password =password;
                let accountCreated = await user.save();
                if (!accountCreated){
                    return {message: "Error al crear la cuenta"};

                }else{
                    return {message: "Cuenta creada satisfactoriamente: "+ accountCreated};
                }
            }
        }
    }catch(err){
        console.log(err);
        return {message: "Error interno en el servidor"};
    }
}

const login = async (args) =>{
    try{
        const userFind = await User.findOne({
            $or: [{username: args[0]}, {email: args[1]}]
        });

        if(!userFind){
            return {message: "Usuario o Correo incorrectos"};

        }else{
            const correctPassword = await bcrypt.compare(args[1], userFind.password);

            if(!correctPassword){
                return {token: jwt.createToken(userFind)}; 
            }
        }
    }catch(err){
        console.log(err);
        return {message: "Error interno en el servidor"};
    }
}