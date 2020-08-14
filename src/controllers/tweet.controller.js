const Reply = require('../models/reply.model');
const Reaction = require('../models/reaction.model');
const Tweet = require('../models/tweet.model');

const addTweet = async (user, args)=>{

    try {
       let tweet = new Tweet();
       let reactions = new Reaction();
       tweet.creator = user.sub;
       tweet.date = new Date();
       tweet.content = args[0];

       const saveReaction = await reactions.save(); 
       if(!saveReaction){

       }else{
         tweet.likes = saveReaction._id;

         const tweetAdded = await ( await tweet.save())
         .populate("creator", "-password -following -followers -name -email")
        .populate("likes", "-_id -interactors")
        .execPopulate();
       if(!tweetAdded){
           return {message: "Error al añadir el nuevo tweet"};

       }else{
           return {message: "Este es el tweet: ", tweetAdded};
       }
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

  const makeLike  = async (id, userId)=>{
    try {
      const liked = await Reaction.findOneAndUpdate({_id: id }, {$push: {interactors: userId}, $inc: {likes: 1}});

      if(!liked){
        return {message: 'Error al querer darle like a este tweet'};
      }else{
        return {message: 'Le has dado like a este tweet'};
      }
    } catch (err) {
      console.log(err);
      return {message: 'Error en el servidor'};
    }
  }

  const dislike = async (id, userId)=>{
    try {
      const disliked = await Reaction.findByIdAndUpdate({_id: id}, {$pull: {interactors: userId}, $inc:{likes: -1}})

      if(!disliked){
        return {message: 'No se encontró el tweet, no se pudo quitar el like'};
        }else{
          return {message: 'Has quitado tu like de este tweet'};
      }
    } catch (err) {
      console.log(err);
      return {message: 'Error en el servidor'};
    }
  }

  const like = async (user, args)=>{
    try {
      const findTweet = await Tweet.findById(args[0])

      if(!findTweet){
        return {message: 'No  se ha encontrado el tweet'}
      }else{
        const preReactions = await Reaction.findOne({$and: [{ _id: findTweet.likes}, {interactors: { _id: user.sub}}]})

        if(!preReactions){
          const doLike = await Reaction.findById(findTweet.likes)
          return await makeLike(doLike._id, user.sub);
          
        }else{
          return await dislike(preReactions._id, user.sub); 
        }
      }
    } catch (err) {
      console.log(err);
      return {message: 'Error en el servidor'};
    }
  }

  const reply = async (user, args) => {
    try {
      const newreply = new Reply();
      const findTweet = await Tweet.findById(args[1]);
      if (!findTweet) return { message: "Este tweet no existe" };
      else {
        newreply.author = user.sub;
        newreply.content = args[0];
        const replyAdded = await newreply.save();
        if (!replyAdded) return { message: "Imposible guardar respuesta" };
        else {
          const addReply = await Tweet.findByIdAndUpdate(
            findTweet._id,
            {
              $push: { replies: replyAdded._id },
            },
            { new: true }
          )
            .populate(
              "creator",
              "-_id -password -following -followers -name -email"
            )
            .populate("likes", "-_id -interactors")
            .populate([
              {
                path: "replies",
                select: "-_id",
                populate: {
                  path: "author",
                  select: "-_id -password -following -followers -name -email",
                },
              },
            ]).populate([
              {
                path: "retweets",
                select: "-_id",
                populate: {
                  path: "creator",
                  select: "-_id -password -following -followers -name -email",
                },
              },
            ]);
  
          return !addReply ? { message: "Reply no agregado" } : addReply;
        }
      }
    } catch (err) {
      console.log(err);
      return { message: "Internal server error" };
    }
  };

  module.exports={
      addTweet,
      updateOrDelete,
      like,
      reply
  }