const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userid: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true // optional, for preventing duplicates
    },
    contact: {
        required: true,
        type: String
    },
    location: {
        required: true,
        type: String
    },
    image: { // added to match your controller
        type: String,
        default: "https://in.images.search.yahoo.com/images/view;_ylt=Awrx.QKfCopoyHwVDXq9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzFiMTZkMTkwODMxMzE0MzYzMTIxN2M3MmJlYjYzNmE1BGdwb3MDMTQxBGl0A2Jpbmc-?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Davatar%2Bimage%26type%3DE211IN714G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26nost%3D1%26tab%3Dorganic%26ri%3D141&w=1569&h=1920&imgurl=static.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F028%2F597%2F534%2Flarge_2x%2Fyoung-cartoon-female-avatar-student-character-wearing-eyeglasses-file-no-background-ai-generated-png.png&rurl=https%3A%2F%2Fwww.vecteezy.com%2Fpng%2F28597534-young-cartoon-female-avatar-student-character-wearing-eyeglasses-png-file-no-background-ai-generated&size=1920KB&p=avatar+image&oid=1b16d1908313143631217c72beb636a5&fr2=piv-web&fr=mcafee&tt=Young+cartoon+female+avatar+student+character+wearing+eyeglasses%2C+PNG+...&b=121&ni=21&no=141&ts=&tab=organic&sigr=ODsUpkTbYIto&sigb=6i2aSqyErZwN&sigi=72U6UuZg3BXa&sigt=Fu0IwEESkdBT&.crumb=iPK5sW5XepO&fr=mcafee&fr2=piv-web&type=E211IN714G0"
    },
}, { timestamps: true }); // optional but recommended

module.exports = mongoose.model('User', dataSchema);


