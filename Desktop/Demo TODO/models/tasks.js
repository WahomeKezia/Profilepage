const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema({
 
    title: {
        type:String ,
        required:true 
    },
    is_completed:{
        type:Boolean,
        required:true 
    },
    date :{
        type: Date,
        default: Date.now

    }   
});

const tasks = mongoose.model("Tasks", tasksSchema);

module.exports = tasks;