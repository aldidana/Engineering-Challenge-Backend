/**
 * FoodsController
 *
 * @description :: Server-side logic for managing foods
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var _ = require('lodash');

module.exports = {

	search: function(req, res) {
		var q = req.query.q;
		// full text search using 'contains', limit result to 10
		var foodQuery = Foods.find({foodName: {"contains" : q}, limit: 10});
		foodQuery.exec(function(err, food) {
			//using lodash to omit foodCompany and foodNutritionTable field
			var a = _.map(food, function(entry) {
			    return _.omit(entry, ['foodCompany', 'foodNutritionTable']);
			});
			return res.json(a);
		});	
	},
	getById: function(req, res) {
		var id = req.params.id;
		//find food with params id
		Foods.findOne().where({id: id}).exec(function(err, food) {
			if (!food) res.status(404).json({
				error: 'Food with that id not found!'
			});
			return res.json(food);
		});

	},
	create: function(req, res) {
		var foodData = req.body;

		Foods.create(foodData).exec(function(err, result) {
			if (!err) {
				return res.json(foodData);
			}
		})
	}
};

