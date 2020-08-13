const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const jwt = require('../services/jwt');


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

  const viewTweets = async (args) => {
    try {
      if (args[0] === "*") {
        const allTweets = await Tweet.find({})
          .populate("creator", "-password -following -followers -name -email")
          .populate("likes", "-_id -interactors")
          .populate("replies", "-_id");
        if (!allTweets) return { message: "No se encontró ningun tweet" };
        else return allTweets;
      } else {
        const userFound = await User.findOne({ username: args[0] });
        if (!userFound)
          return { message: "Este usuario no existe" };
        else {
          const tweets = await Tweet.find({ creator: userFound._id })
            .populate("creator", "username")
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
  
          if (!tweets) return { message: "No se encontró ningún tweet" };
          else if (tweets.length === 0)
            return { message: `${userFound.username} Aun no tienes tweets.` };
          else return tweets;
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
          const addFollowing = await User.findByIdAndUpdate(
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

  const showProfile = async (user, args) =>{
    try {
        const following = await User.findOne({username: args[0] }).populate(
            "following", "-following -password -followers -name -email",
        ).populate("followers", "-followers -password -following -name -email")
        if(!following){
            return {message: 'No existe este perfil'}
        }else{
            return following;
        }
    } catch (error) {
        
    }
}

  const generatePassword = async (password) => {
    return await new Promise((res, rej) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) rej(err);
        res(hash);
      });
    });
  };

  module.exports = {
    signUp,
    login,
    viewTweets,
    followUser,
    unfollowUser,
    showProfile
  }