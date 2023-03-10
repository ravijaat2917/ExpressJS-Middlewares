const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');
const url = 'mongodb://localhost:27017/userDB';
mongoose.connect( url , {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

// helpful function for checking the user is registering or already registered and heshing the password
userSchema.pre('save', (next)=>{
    if( !this.isModified('password') ){
        return next();
    }
    this.password = bcrypt.hashSync(this.password,12);
    next();
});

// compare password for login
userSchema.methods.comparePassword = (plainText , callback )=>{
    return callback(null , bcrypt.compareSync(plainText , this.password));
};

const userModel = mongoose.model('users' , userSchema);

module.exports = userModel ;