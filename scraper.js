var x = require('x-ray')();
var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');

//connect to mongodb database using mongoose
mongoose.connect('mongodb://localhost/foodscraper');
var Schema = mongoose.Schema;

//Scrape destination
var foodUrl = 'http://www.myfitnesspal.com/food/calorie-chart-nutrition-facts';

//food schema
var foodSchema = new Schema(
	{
		foodName: {type: String, index: 'text'}, //set foodName index as text for full text search
		foodCompany: String,
		foodNutritionTable: {}
	},
	{
		versionKey: false //disable mongoose versionKey
	}
);

//define food model
var Food = mongoose.model('Food', foodSchema);

console.log('Ready ..');

async.waterfall([
	function(done) {
		console.log('Scraping ..');
		//get url from foodUrl variable and start scraping
		x(foodUrl, '#popular_tags li', ['a@href'])(function(err, tags) {
			done(err, tags);
		});
	}, function(tagsUrl ,done) {
		_.forEach(tagsUrl, function(url) {
			x(url, '.food_search_results li', ['.food_description a@href'])
				.paginate('.next_page @href')
				(function(err, u) {
					var foodUrl = _.filter(u, function(u) {
						return u.indexOf('/food/calories/') > -1;
					});
					done(err, foodUrl);
				});
		});
	}, function(foodUrl, done) {
		_.forEach(foodUrl, function(url) {
			x(url, '#main', {
				foodName: '.food-description',
				foodCompany: '#other-info .col-1 .secondary-title',
				foodNutritionTable: 
					{
						keys: ['td.col-1'],
						values: ['td.col-2'] 
					}
			})(function(err, foodDetail) {
				done(err, foodDetail);
			});
		});
	}, function(foodDetail, done) {
		var nutrition = foodDetail.foodNutritionTable;
		//Remove Non-breakable space 0xa0 (160 dec)
		var keys = _.without(nutrition.keys, '\xA0');
		var values = _.without(nutrition.values, '\xA0');
		var foodName = foodDetail.foodName;
		var foodCompany = foodDetail.foodCompany;
		//just get company name
		foodCompany = foodCompany.replace('More from ', '').trim();
		var nutritionData = {};

		_.forEach(foodDetail, function(food) {
			for (var i = 0; i < keys.length; i++) {
				nutritionData[keys[i]] = values[i];
			}
		});
		//represent Food using food
		var food = new Food({
			foodName: foodName,
			foodCompany: foodCompany,
			foodNutritionTable: nutritionData
		});
		//insert data into database
		food.save(function (err, docs) {
		  if (err) console.log(err);
		  //count inserted data
		  Food.count({}, function(err, count) {
		  	if (count == 1) {
		  		console.log(count+' food inserted into database');	
		  	} else {
		  		console.log(count+' foods inserted into database');	
		  	}
		  });
		});

		done(err, 'finished, press CTRL + C to close');
	}

], function(err) {
	if (err) console.log(err);
});