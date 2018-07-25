/* GET home page */
const index = function(req, res){
    res.render('index', {title: 'NVMAPI'});
}
module.exports = {
    index
};
