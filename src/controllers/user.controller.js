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
        return {message: "Error en el servidor"};
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
        return {message: "Error en el servidor"};
    }
}

const addTweet = async (user, args)=>{

    try {
       let tweet = new Tweet();
       tweet.creator = user.sub;
       tweet.date = new Date();
       tweet.content = args[0];

       const tweetAdded = await tweet.save();
       if(!tweetAdded){
           return {message: "Error al añadir el nuevo tweet"};

       }else{
           return {message: "Este es el tweet: " + tweetAdded};
       }
    }catch(err){
        console.log(err);
        return {message: "Error en el servidor"}    
    }
}

const switchUpdateDelete = async (user, args, operation) => {
    try {
      let resultTweet;
      let tweetFound;
      if (operation === 0) {
          tweetFound = await Tweet.findById(args[1]);
      }else {
          tweetFound = await Tweet.findById(args[0]);
        }
  
      if (!tweetFound) {
          return { message: "Este tweet no existe" };
      }else {
        if (String(user.sub) !== String(tweetFound.creator)) {
          return { message: " Lo sentimos, no tienes acceso a este tweet" };
        } else {
          if (operation === 0) {
            resultTweet = await Tweet.findByIdAndUpdate(
              args[1],
              { content: args[0] },
              { new: true }
            );
          } else {
            resultTweet = await Tweet.findByIdAndRemove(args[0]);
          }
          if (!resultTweet){
            return { message: "Ha ocurrido un error, intenta de nuevo mas tarde" };
          }else {
            if (operation === 0) {
                return resultTweet;
            }else{
                return { message: "Tweet eliminado" };
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      return { message: "Error en el servidor" };
    }
  };

  const viewTweets = async (args) => {
    try {
      const userFind = await User.findOne({ username: args[0] });
      if (!userFind)
        return { message: "Este usuario no existe" };
      else {
        const tweets = await Tweet.find({ creator: userFind._id }).populate(
          "creator",
          "-_id username"
        );
        if (!tweets){ 
            return { message: "Imposible obtener los tweets" };
        }else if (tweets.length === 0){
          return { message: `${userFind.username} aún no tienen ningún tweet.` };
        }else{
            return tweets;
        }
      }
    } catch (err) {
      console.log(err);
      return { message: "Erroe en el servidor" };
    }
  };

  module.exports = {
    commands
  }