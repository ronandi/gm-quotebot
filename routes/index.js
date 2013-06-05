
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.handleMessage = function(req, res) {
    console.log(req.body);
};
