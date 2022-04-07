var express = require('express');
const { redirect } = require('express/lib/response');
var router = express.Router()
const tasks = require('../models/tasks');


// gets all posts 
router.get('/', async (req, res) => {
    try{
        const posts = await this.tasks.find(); 
        res.json(posts);
    } catch(err){
        res.json({
            message:err
        });
    }
  });
 //submits a post
router.post('/', async(req ,res)=> {;
    const post = new tasks({
      id: req.body.id,
      title: req.body.title,
      is_completed: req.body.is_completed
});
try{
const savePost = await post.save();
res.json(savePost);
}catch(err){
    res.json({ message: err});
}

});
//a speficic post 
router.get('/:postId',async (req ,res) => {
    try{
    const post = await tasks.findbyId(req.params.postId)
    res.json(post);
    }catch(err){
      res.json({message: err })  
    }
});
// deleting 
router.delete('/:postId' , async(req ,res)  => {
    try{
   const Deleted=  await tasks.remove({_id : req.params.postId}) 
   res.json(Deleted)
    }catch(err){
        res.json({message: err })  
      }
// update a post 
router.patch('/:postId' , async(req ,res)  =>{
    try{
const updatepost = await tasks.updateOne({_id : req.params.postId } ,{$set:{is_completed: req.body.is_completed}
});
res.json(updatepost);
    }
catch(err){
    res.json({message: err })  
  }

})
})
 module.exports = router; 