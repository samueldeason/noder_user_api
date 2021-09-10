const User = require('../models/User')
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

//update user
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            catch(error){
                return res.status(500).json(error)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account updated!")
        }catch(error){
            return res.status(500).json(error)
        }
    }else{
        return res.status(403).json("You can only update your account!");
    }
})
//delete a user
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("Account has been deleted!")
        }catch(error){
            return res.status(500).send(error)
        }
    }else{
        return res.status(403).json("You can only delete your account!");
    }
})
//get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})
//follow a user
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            console.log(user)
            if(!user.followers.includes(req.body.userId)){
                console.log("made it this far")
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({$push: {following: req.body.userId}});
                res.status(200).json("Followed user!")
            }else{
                res.status(403).json("Your already following this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }

    }else{
        res.status(403).json("Can't Follow yourself")
    }
})

//unfollow user
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            console.log(user)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers: req.body.userId}})
                await currentUser.updateOne({$pull: {following: req.body.userId}});
                res.status(200).json("Unfollowed user!")
            }else{
                res.status(403).json("Your don't follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }

    }else{
        res.status(403).json("Can't unfollow yourself")
    }
})


module.exports = router;