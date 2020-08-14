const Retweet = require('../models/retweet.model');
const Tweet = require('../models/tweet.model');

const makeRetweet = async (user, args)=>{
try {
    const findTweet = await Tweet.findById(args[1]);
    if(!findTweet){
      return {message: 'No se ha encontrado el tweet'}
      
    }else{
        const newRetweet = Retweet();
        newRetweet.creator = user.sub;
        if(args[0]!= ""){
            newRetweet.comment = args[1];
        } else{
            const retweetAdded = await newRetweet.save()
            if(!retweetAdded){
                return {message: 'No se pudo agregar el retweet'}
            }else{
                const updateTweet = await Tweet.findByIdAndUpdate(findTweet._id, {$push: {retweets: retweetAdded._id}}, {new: true}).populate(
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
                  ]);
                return !updateTweet ? {message: 'El retweet no se pudo agreggar'} :updateTweet
            }
            
        }
    }
    
} catch (err) {
    console.log(err);
    return {message: 'Error en el servidor'};
}
    
  }

  module.exports={
    makeRetweet
  }