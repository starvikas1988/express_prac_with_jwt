var mongoose = require('mongoose')

const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        minLength:10,
        unique:true
    },
    userType:{
        type:String,
        default:'CUSTOMER',
        enum:["CUSTOMER","ADMIN"]
    }
},{timestamps:true , versionKey:false})

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model("User", userSchema);