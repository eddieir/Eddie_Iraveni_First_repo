var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var app=express();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
/* GET home page. */
// Defines the root route. router.get receives a path and a function
// The req object represents the HTTP request and contains
// the query string, parameters, body, header
// The res object is the response Express sends when it receives
// a request
// render says to use the views/index.jade file for the layout
// and to set the value for title to 'Express'
router.get('/', function(req, res, next) {

    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;

    // Define where the MongoDB server is
    var url = 'mongodb://localhost:27017/guestmap';

    // Connect to the server
    console.log('the list');
    MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      // We are connected
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('BOSCHdata');
      // Find all students
      data = '';
      collection.find().toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          console.log(result);
          res.send(200, {
            // Pass the returned database documents to Jade
            "parkingList" : result
          });
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });
    }
    });
});

// Route to the page we can add students from using newstudent.jade
router.get('/new', function(req, res){
    res.json(200,'{location: New parking location added}' );
});

router.get('/',function(req,res){
  res.render('home');
});

router.get('./views/register',function(req,res){
  res.render('login');
});

//Login to database
router.post('/demo',urlencodedParser,function(req,res){
  MongoClient.connect(url,function(err,db){
    db.collection('userinformation').findOne({name:req.body.name},function(err,user){
      if(user==null){
        res.end("Invalid login");
      }else if(user.name===req.body.name && user.pass === req.body.pass){
        router.render('completeprofile',{profileData:user});
      }else{
        console.log("credentials wrong");
        res.end("LOgin invalid,please try again");
      }
    });
  });
});
router.post('/addParkingslot', function(req, res){

    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;

    // Define where the MongoDB server is
    var url = 'mongodb://localhost:27017/BOSCHdata';

    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');

        // Get the documents collection
        var collection = db.collection('BOSCHdata');

        // Get the parkinginformation data passed from the form
        var datainfo = {id: req.body.id, Phone: req.body.Phone,
          city: req.body.city, navigationAddress: req.body.navigationAddress, peps: req.body.peps,
          amenities: req.body.amenities, structured_rates:req.body.structured_rates, url:req.body.url
          , buildingAddress: req.body.buildingAddress,type:req.body.type,structured_rates:req.body.structured_rates,
          spacesTotal:req.body.spacesTotal , name:req.body.name ,  pmtTypes:req.body.pmtTypes , point: req.body.point, href: req.body.href
          , phones:req.body.phones , occupancy:req.body.occupancy , photos:req.body.photos
        };

        // Insert the parking data into the database
        collection.insert([datainfo], function (err, result){
          if (err) {
            console.log(err);
          } else {

            // Redirect to the updated student list
            res.json(result);
          }

          // Close the database
          db.close();
        });

      }
    });

  });
  router.post('/update', function(req, res, next) {
  var item = {
    id: req.body.id, Phone: req.body.Phone,
      city: req.body.city, navigationAddress: req.body.navigationAddress, peps: req.body.peps,
      amenities: req.body.amenities, structured_rates:req.body.structured_rates, url:req.body.url
      , buildingAddress: req.body.buildingAddress,type:req.body.type,structured_rates:req.body.structured_rates,
      spacesTotal:req.body.spacesTotal , name:req.body.name ,  pmtTypes:req.body.pmtTypes , point: req.body.point, href: req.body.href
      , phones:req.body.phones , occupancy:req.body.occupancy , photos:req.body.photos
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('BOSCHdata').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('BOSCHdata').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

module.exports = router;
