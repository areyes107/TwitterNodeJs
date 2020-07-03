const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const jwt = require('../services/jwt');
const TwitterCommand = require('twitter-command');


const signUp = async (args) => {
    const user = User();

    try{
        let userExists = await User.findOne({
            $or: [{email: args[1]}, {username: args[2]}],
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
};

const login = async (args) =>{
    try{
        const userFind = await User.findOne({
            $or: [{ username: args[0] }, { email: args[0] }],
        });

        if(!userFind){
            return {message: "Usuario o Correo incorrectos"};

        }else{
            const correctPassword = await bcrypt.compare(args[1], userFind.password);
            if(!correctPassword){
                return {message: 'Contraseña incorrecta'};
            }else{
                return { token: jwt.createToken(userFind) }; 
            }
        }
    }catch(err){
        console.log(err);
        return {message: "Error en el servidor"};
    }
};

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

const updateOrDelete = async (user, args, operation) => {
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


  const followUser = async (user, args) => {
    try {
      const follow = await User.findOne({ username: args[0] });
      if (!follow)
        return { message: "Este usuario no existe" };
      else {
        const alreadyFollowed = await User.findOne({
          $and: [{ _id: user.sub }, { following: { _id: follow._id } }],
        });
        if (alreadyFollowed)
          return { message: `ya sigues a: ${follow.username}` };
        else {
          const addfollowing = await User.findByIdAndUpdate(
            user.sub,
            { $push: { following: follow } },
            { new: true }
          ).populate("following", "-password -following -followers -name -email");
          const addFollower = await User.findByIdAndUpdate(follow._id, {
            $push: { followers: user.sub },
          });
          if (addFollowing && addFollower) {
            return addFollowing;
          } else {
            return { message: `Error al intentar seguir a:  ${follow.username}` };
          }
        }
      }
    } catch (err) {
      console.log(err);
      return { message: "Error en el servidor" };
    }
  };

  const unfollowUser = async (user, args) => {
    try {
      const unfollow = await User.findOne({ username: args[0] });
      if (!unfollow)
        return { message: "Este usuario no existe" };
      else {
        const following = await User.findOne({
          $and: [{ _id: user.sub }, { following: { _id: unfollow._id } }],
        });
        if (!following)
          return { message: `No estás siguiendo a: ${unfollow.username}` };
        else {
          const stopFollowing = await User.findByIdAndUpdate(
            user.sub,
            { $pull: { following:unfollow._id } },
            { new: true },
          ).populate("following", "-following -password -followers -name -email")
           .select("username");
  
          const removeFollower = await User.findByIdAndUpdate(unfollow._id, {
            $pull: { followers:user.sub  },
          });
  
          if (stopFollowing && removeFollower) {
            return stopFollowing;
          } else {
            return { message: `Error al intentar de seguir a: ${unfollow.username}` };
          }
        }
      }
    } catch (err) {
      console.log(typeof err);
      return { message: "Error en el servidor" };
    }
  };

  const generatePassword = async (password) => {
    return await new Promise((res, rej) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) rej(err);
        res(hash);
      });
    });
  };

  const mapAction = async (user, { command, args }) => {
    try {
      if (command === "invalid command") {
          return { message: "Invalid command" };
      }else if (args === "invalid arguments"){
        return { message: "Invalid arguments" };
      }else {
        switch (command.toLowerCase()) {
          case "register":
            return await signUp(args);
            break;
          case "login":
            return await login(args);
            break;
          case "add_tweet":
            return await addTweet(user, args);
            break;
          case "edit_tweet":
            return await updateOrDelete(user, args, 0);
            break;
          case "delete_tweet":
            return await updateOrDelete(user, args, 1);
            break;
          case "view_tweets":
            return await viewTweets(args);
            break;
          case "follow":
            return await followUser(user, args);
            break;
          case "unfollow":
            return await unfollowUser(user, args);
            break;
          default:
            return { message: "Invalid command try again" };
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const commands = async (req, res) => {
    
    try {
      res.send(await mapAction(req.user, TwitterCommand.getAction(req)));
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Error en el servidor" });
    }
  };

  module.exports = {
    commands
  }