var express = require('express');
var router = express.Router();
var request = require('superagent');
var fs = require('fs');
var Q = require('q');

/* GET items list. */
router.get('/', function(req, res, next) {
    getItemList().then(function(results){
        results = 'respond with a resource';
        res.send(results,200);
    })
    var categoryDictionary = {};
    for(var i = 0; i<1; i++){
        getCategoryDetails(i);
    }
});

function getItemList(){
    var deferred = q.defer();

    return deferred.promise;
}

function getCategoryDetails(categoryID){
    request.get('services.runescape.com/m=itemdb_rs/api/catalogue/category.json?category=' + categoryID)
    .end(function(err, res){
        if(err){
            console.log(err);
        } else {
            var itemQuantities = JSON.parse(res.text);
            traverseCategoryItems(categoryID, itemQuantities.alpha);
        }
    })
}

function traverseCategoryItems(categoryID, itemQuantityArray){
    itemQuantityArray.forEach(function(alpha){
        if(alpha.items !== 0){
            if(alpha.letter === '#') {
                alpha.letter = '%23';
            }
            request.get('services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=' + categoryID + '&alpha=' + alpha.letter + '&page=' + 1)
            .end(function(err, res){
                if(err){
                    console.log(err);
                } else {
                    var itemQuantities = JSON.parse(res.text);
                    traverseCategoryItems(categoryID, itemQuantities);
                }
            })   
        }
    })
}

module.exports = router;
