# Holmusk Backend-Developer-Challenge

`version 1.0`

Name: Aldi Priya Perdana

## Getting Started

* Clone this repository `git clone https://github.com/aldidana/Engineering-Challenge-Backend.git scraper`
* `cd scraper`
* `npm install`
* To run scraper `node scraper.js`
* Change directory to foodScraper `cd foodScraper`
* `npm install`
* `sails lift` to run api server

## Consume API

* `GET http://localhost:1337/foods/search?q={food-name}` endpoint to search food, replace food-name to anything food name you want to search (support autocomplete). Example: `curl http://localhost:1337/foods/search?q=beef`
* `GET htpp://localhost:1337/foods/{foodId}` endpoint to retrive the nutritional information for a given food id
* `POST http://localhost:1337/foods/create` endpoint to manually create/insert food data into database