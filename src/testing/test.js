require('dotenv').config();
const multer = require('multer');
const S3 = require('aws-sdk/clients/s3');

/*to prevent deprecated messages*/
require("aws-sdk/lib/maintenance_mode_message").suppress = true; 

const awsS3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID, 
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    
    const allowedTypes = /pdf|docx|png|jpeg|jpg/;
    const extname = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);        
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const testingFn = async (req, res) => {
    try {
        console.log("Start")
        if (!req.file) {
            console.log("No file uploaded or invalid file type");
            return res.status(400).send({ message: 'No file uploaded or invalid file type!' });
        }

        const file = req.file;
        const path = `uploads/${Date.now()+file.originalname}`; 

        const params = {
            Bucket: process.env.S3_BUCKET, 
            Key: path,
            Body: file.buffer 
        };

        console.log("Upload Start")
        console.log(params,path,file.originalname)
        // return res.status(500).send({ message: "error.message" });
        awsS3.upload(params, (err, data) => {
            if (err) {
                console.log("Error uploading invoice: ", err.message);
                return res.status(500).json({ message: err.message });
            }
        console.log(" S3 File uploaded successfully: ", req.file);
        return res.status(200).send({
            message: 'Invoice uploaded successfully!',
            file: req.file
        });
    });
    } catch (error) {
        console.log("Error uploading invoice: ", error.message);
        return res.status(500).send({ message: error.message });
    }
}

module.exports = {
    testingFn
}