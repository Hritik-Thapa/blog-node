const {Schema,model}=require('mongoose');
const {createHmac, randomBytes}=require('node:crypto');

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
        required:true
    },
    pfpUrl:{
        type:String,
        required:true,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    password:{
        type:String,
        required:true
    }

})

userSchema.pre('save',function (next){
    const user=this;

    if(!user.isModified("password")) return;

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest('hex')
})

const User=model('user',userSchema);

module.exports=User;