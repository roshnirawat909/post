const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/upload');
  },

  filename: function (req, file, cb) {
     crypto.randomBytes(12,(err,bytes)=>{
      const fn = bytes.toString("hex") + path.extname(file.originalname);

      //bytes.toString("hex")  it will convert into hexadecimal 
      //path.extname(file.originalname) this is used to obtain the extension of file name like abc.txt 
      //it will convert into txt
          cb(null, fn);
    })
  }

})

const upload = multer({ storage: storage });

// export the variable  

module.exports = upload;