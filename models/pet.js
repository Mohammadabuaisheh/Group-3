const mongoose=require('mongoose');
const petSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true



    },
    breed:String,
    age:Number,
    gender:String,
    description:String,
    image:String,
    status:{
        type:String,
        default:'Available'
    }
},
{timestamps:true});
module.exports=mongoose.model('Pet',petSchema);







