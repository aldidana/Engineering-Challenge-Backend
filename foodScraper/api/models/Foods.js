/**
* Foods.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	//disable autoCreatedAt and autoUpdatedAt
	autoCreatedAt: false, 
	autoUpdatedAt: false,
	attributes: {
		foodName: {type: 'string', required: true},
		foodCompany: 'string',
		foodNutritionTable: {type: 'json'}
	}
};

