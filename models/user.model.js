import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true    
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["student","admin","recruiter"],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, //URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{
            type:String,
            default:""
        },
        // experience:[{
        //     company:{type:String},
        //     position:{type:String},
        //     startDate:{type:Date},
        //     endDate:{type:Date},
        //     description:{type:String}
        // }],
        // education:[{
        //     institution:{type:String},
        //     degree:{type:String},
        //     fieldOfStudy:{type:String},
        //     startDate:{type:Date},
        //     endDate:{type:Date},
        //     description:{type:String}
        // }]
    }
},{timestamps:true});

export const User = mongoose.model("User",userSchema);