const mongoose= require('mongoose');

const ownerSchema= mongoose.userSchema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: String,
    password: String,
    isadmin: Boolean,
    products: {
        type: Array,
        default: []
    },
    pictures: String,
    gstin: String,
});

module.exports= mongoose.model("owner", ownerSchema);
