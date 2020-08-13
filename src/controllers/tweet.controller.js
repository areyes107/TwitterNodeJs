const Reply = require('../models/reply.model');
const Reaction = require('../models/reaction.model');
const Tweet = require('../models/tweet.model');

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
};

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

  module.exports={
      addTweet,
      updateOrDelete
  }