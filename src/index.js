import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const PORT = process.env.PORT || 5000
const app = express();
const router = express.Router();
const moment = require('moment');
const path = require('path');
const HummusRecipe = require('hummus-recipe');
var fs = require('fs');
const request = require("request-promise-native");

app.use(cors());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/pdf');
    res.header('Access-Control-Expose-Headers','Content-Disposition');
    next();
});


router.route('/getResume').put((req, res) => {
    let url = req.body.url
    try {
        fs.unlinkSync(path.join(__dirname, '/outputFile.pdf'));
    } catch (error) {

    }
    let src;
    const output = path.join(__dirname, '/outputFile.pdf');

    function downloadPDF(pdfURL, outputFilename) {
        src = path.join(__dirname, outputFilename);
        try {
            return request.get({ uri: 'https://storage.googleapis.com/venkateshkannan-resume.appspot.com/Resume1.pdf', encoding: null }).then(dta => {
                fs.writeFileSync(src, dta);
                return true;
            });
        } catch (error) {
            
        }
        

    }

    downloadPDF(url, '/resume.pdf').then(dta => {

        let joiningDate = moment("2015-05-18");
        let currentDate = moment();
        let diff = currentDate.diff(joiningDate, 'years', true).toFixed(1);
        console.log(diff, ' years experience on ', moment().format('YYYY-MM-DD'));
        const pdfDoc = new HummusRecipe(src, output);
        pdfDoc
            .editPage(1)
            .text(diff, 408, 99, {
                color: '#000000',
                fontSize: 9,
                font: 'Arial',
            })
            .endPage()
            .endPDF();
        var file = fs.createReadStream(output);
        var stat = fs.statSync(output);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        file.pipe(res);
    })
});

router.route('/').get((req, res) => {
res.send('Hello there')
});

router.route('/getResume').get((req, res) => {
    res.redirect('https://venkatesh-kannan.web.app/')
    });

app.use('/', router);

app.listen(PORT, () => console.log(`Listening on ${PORT}`))