const { getAction } =require('twitter-command');

const {
    signUp,
    signIn,
    followUser,
    unfollowUser,
    viewTweets,
    profile,
  } = require("./user.controller");

  const {
    addTweet,
    switchUpdateDelete,
    like,
    makeReply,
  } = require("./tweet.controller");

  const commands = async (req, res) => {
    
    try {
      res.send(await mapAction(req.user, TwitterCommand.getAction(req)));
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Error en el servidor" });
    }
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
            case "profile":
                return await showProfile(user, args)
          default:
            return { message: "Comando inválido, inténtalo de nuevo mas tarde" };
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  module.exports = {
      commands
  }
