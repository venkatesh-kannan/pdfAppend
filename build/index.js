'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 5000;
var app = (0, _express2.default)();
var router = _express2.default.Router();
var moment = require('moment');
var path = require('path');
var HummusRecipe = require('hummus-recipe');
var fs = require('fs');
var request = require("request-promise-native");

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/pdf');
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
});

router.route('/getResume').get(function (req, res) {
    try {
        fs.unlinkSync(path.join(__dirname, '/outputFile.pdf'));
    } catch (error) {}
    var src = void 0;
    var output = path.join(__dirname, '/outputFile.pdf');

    function downloadPDF(outputFilename) {
        src = path.join(__dirname, outputFilename);
        try {
            return request.get({ uri: 'https://firebasestorage.googleapis.com/v0/b/venkatesh-kannan.appspot.com/o/venkatesh-2.pdf?alt=media&token=52587cc2-b85c-4f27-a37b-bf48c5cc24e1', encoding: null }).then(function (dta) {
                fs.writeFileSync(src, dta);
                return true;
            });
        } catch (error) {}
    }

    downloadPDF('/resume.pdf').then(function (dta) {
        var joiningDate = moment("2015-05-18");
        var currentDate = moment();
        var diff = currentDate.diff(joiningDate, 'years', true).toFixed(1);
        console.log(diff, ' years experience on ', moment().format('YYYY-MM-DD'));
        var pdfDoc = new HummusRecipe(src, output);
        pdfDoc.editPage(1).text(diff, 408, 100, {
            color: '#000000',
            fontSize: 9,
            font: 'Arial'
        }).endPage().endPDF();
        var file = fs.createReadStream(output);
        var stat = fs.statSync(output);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        file.pipe(res);
    });
});

app.use('/', router);

app.listen(PORT, function () {
    return console.log('Listening on ' + PORT);
});
//# sourceMappingURL=index.js.map