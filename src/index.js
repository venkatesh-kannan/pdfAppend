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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

    async function downloadPDF(pdfURL, outputFilename) {
        src = path.join(__dirname, outputFilename);
        let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });
        fs.writeFileSync(src, pdfBuffer);
    }

    downloadPDF(url, '/resume.pdf').then(dta => {

        let joiningDate = moment("2015-05-18");
        let currentDate = moment();
        let diff = currentDate.diff(joiningDate, 'years', true).toFixed(1);
        console.log(diff,' years experience on ',moment().format('YYYY-MM-DD'));
        const pdfDoc = new HummusRecipe(src, output);
        pdfDoc
            .editPage(1)
            .text(diff, 378, 68, {
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
        res.setHeader('Content-Disposition', 'attachment; filename=venkatesh_kannan.pdf');
        file.pipe(res);
    })
});


app.use('/', router);

app.listen(PORT, () => console.log(`Listening on ${PORT}`))