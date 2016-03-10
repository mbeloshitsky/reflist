var reflist = [
		{
			system: 		'ЭЦ-МПК' 
			, description: 	'ст. Пикалево–1'
			, arrows: 		25
			, deployed_on: 	'01.11.2001'
			, latlng: 		[59.557095, 34.083609]
		},
		{
			system: 		'ЭЦ-МПК' 
			, description: 	'ст. Муслюмово'
			, arrows: 		21
			, deployed_on: 	'01.11.2006'
			, latlng: 		[55.58582, 61.597578]
		},
		{
			system: 		'ЭЦ-МПК' 
			, description: 	'ст. Юргамыш'
			, arrows: 		19
			, deployed_on: 	'01.12.2012'
			, latlng: 		[55.369694, 64.457895]
		}
	]
	, ymap = null;

function updateMap(reflist) {
	ymap.geoObjects.removeAll();

	reflist.forEach(function (obj) {
        ymap.geoObjects.add(new ymaps.Placemark(obj.latlng, { 
            hintContent: 	obj.description, 
            balloonContent: obj.description 
        }));
	});
}

 
document.addEventListener("DOMContentLoaded", function(e){
	var vue = new Vue({
	  el: '#app',
	  data: {
	    message:   'Hello Vue.js!'
	    , reflist: reflist
	  },
	  watch: {
	  	reflist: updateMap
	  }
	})

	ymaps.ready(function () {
		ymap = new ymaps.Map("map", {
	        center: [60.187797,56.338410], 
	        zoom: 	4
	    });
	    updateMap(reflist)
	})
})

Vue.filter('plural', function (a, str1, str2, str3) {
  	function suffix(a) {
  		if (a % 10 == 1 && a % 100 != 11 ) 
	  		return str1;
	  	else if ( a % 10 >= 2 && a % 10 <= 4 && ( a % 100 == 20)) 
	  		return str2;
	    else return str3;
  	}
  	return a + ' ' + suffix(Number(a));
})