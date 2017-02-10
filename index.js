	/*******************************************
	* Made by Remi JOUGLET & Aurelie LE CALVEZ *
	*******************************************/
function get_datas(){
	//console.log(datas);
	console.log("starting");
	//var express = require('express');
	//var fs = require('fs');
	var request = require('request');
	var cheerio = require('cheerio');
	//var app = express();

	var url_leboncoin = datas.link;//document.getElementById("contact-submit").value;
	var url_meilleurs_agents = "";

	var json = { goods : "", city : "", cp : "",  price : "", surface : ""};
	var mean_price = "";

	function findTextAndReturnRemainder(target, variable){
		var chopFront = target.substring(target.search(variable)+variable.length,target.length);
		var result = chopFront.substring(0,chopFront.search(";"));
		return result;
	}
	request(url_leboncoin, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			
			var goods, city, price, surface, cp;	

			var text = $($('script')).text();
			var findAndClean = findTextAndReturnRemainder(text,"var utag_data =");
			var str = findAndClean.substr(findAndClean.indexOf('{'), findAndClean.indexOf('}'));
			var surface = str.substring(str.search('surface'), str.search('surfacemin'));
			json.surface = surface.substring(surface.indexOf('"')+1, surface.search(',')-1);
			var cp = str.substring(str.search('cp'), str.search('city'));
			json.cp = cp.substring(cp.indexOf('"')+1, cp.search(',')-1);
			var city = str.substring(str.search('city'), str.search('ad_type'));
			json.city = city.substring(city.indexOf('"')+1, city.search(',')-1);
			var price = str.substring(str.search('prix'), str.search('prixmin'));
			json.price = price.substring(price.indexOf('"')+1, price.search(',')-1);
			var goods = str.substring(str.search('piecesmax'), str.search('options : {'));
			var temp = goods.substr(goods.indexOf('type')+6);
			json.goods = temp.substring(temp.indexOf('"')+1, temp.search(',')-1);
			console.log(city);
			url_meilleurs_agents = "https://www.meilleursagents.com/prix-immobilier/"+json.city+"-"+json.cp+"/";
			
			if(json.city == "paris" || json.city == "marseille" || json.city == "lyon"){
				var arrondissement = json.cp.substr(json.cp.length-2, 2);
				console.log(arrondissement);
				url_meilleurs_agents = "https://www.meilleursagents.com/prix-immobilier/"+json.city+"-"+arrondissement+"eme-arrondissement-"+json.cp+"/";
			}
			
			document.getElementById("price").value = json.price;
			document.getElementById("goods").value = json.goods;
			document.getElementById("surface").value = json.surface;
		}
	});

	(function wait () {
	   if (url_meilleurs_agents == "") {
		   setTimeout(wait, 1000);
		}
	   else {
		   go_further(url_meilleurs_agents);
		}
	})();

	function go_further(url_meilleurs_agents){
		console.log(url_meilleurs_agents);
		request(url_meilleurs_agents, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);
				$('meta').each(function(i, element){
			
					var data = $(this);
					if(data.attr('name') == 'description'){
						var price = data.attr('content').substring(data.attr('content').search(json.goods), data.attr('content').search('Classement'));
						mean_price = price.substring(price.indexOf(':')+2, price.search('€')-1);
						if(isNaN(mean_price)){
							price = data.attr('content').substring(data.attr('content').search(json.goods), data.attr('content').search('Evolution'));
							mean_price = price.substring(price.indexOf(':')+2, price.search('€')-1);
						}
						document.getElementById("mean_price").value = mean_price;
						console.log(mean_price);
					}
				});			
			}
		});
	};

	(function wait_2 () {
	   if (mean_price == "") {
		   console.log("wait2");
		   setTimeout(wait_2, 1000);
		}
	   else {
		   print_results(mean_price);
		}
	})();


	function print_results(mean_price){
		var price_expected = json.surface * mean_price;
		document.getElementById("price_expected").value = price_expected;
		
		if(price_expected < json.price){
			document.getElementById("result").value = "C'est une arnaque !";
			console.log("C'est une arnaque !");
		} else {
			document.getElementById("result").value = "C'est une affaire !";
			console.log("C'est une affaire !");
		}
		console.log(json.price);
		console.log(price_expected);
		document.getElementById("results").style.display = "block";
	}
}