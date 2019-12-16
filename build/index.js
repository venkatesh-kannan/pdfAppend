'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.route('/getResume').put(function (req, res) {
    var downloadPDF = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pdfURL, outputFilename) {
            var pdfBuffer;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            src = path.join(__dirname, outputFilename);
                            _context.next = 3;
                            return request.get({ uri: pdfURL, encoding: null });

                        case 3:
                            pdfBuffer = _context.sent;

                            fs.writeFileSync(src, pdfBuffer);

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function downloadPDF(_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();

    var url = req.body.url;
    try {
        fs.unlinkSync(path.join(__dirname, '/outputFile.pdf'));
    } catch (error) {}
    var src = void 0;
    var output = path.join(__dirname, '/outputFile.pdf');

    downloadPDF(url, '/resume.pdf').then(function (dta) {

        var joiningDate = moment("2015-05-18");
        var currentDate = moment();
        var diff = currentDate.diff(joiningDate, 'years', true).toFixed(1);
        console.log(diff, ' years experience on ', moment().format('YYYY-MM-DD'));
        var pdfDoc = new HummusRecipe(src, output);
        pdfDoc.editPage(1).text(diff, 378, 68, {
            color: '#000000',
            fontSize: 9,
            font: 'Arial'
        }).endPage().endPDF();
        var file = fs.createReadStream(output);
        var stat = fs.statSync(output);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=venkatesh_kannan.pdf');
        file.pipe(res);
    });
});

app.use('/', router);

app.listen(PORT, function () {
    return console.log('Listening on ' + PORT);
});
//# sourceMappingURL=index.js.map