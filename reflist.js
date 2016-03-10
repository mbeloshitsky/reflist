var reflist = [
		{
			system: 		'ЭЦ-МПК' 
			, title: 		'ст. Пикалево–1'
			, arrows: 		25
			, deployed_on: 	'2001-11-01'
			, deployed_by: 	'ЦКЖТ'
			, latlng: 		[59.557095, 34.083609]
		},
		{
			system: 		'ЭЦ-МПК' 
			, title: 		'ст. Муслюмово'
			, arrows: 		21
			, deployed_on: 	'2006-11-01'
			, deployed_by: 	'НИЛ КСА'
			, latlng: 		[55.58582, 61.597578]
		},
		{
			system: 		'ЭЦ-МПК' 
			, title: 		'ст. Юргамыш'
			, arrows: 		19
			, deployed_on: 	'2012-12-01'
			, deployed_by: 	'НИЛ КСА'
			, latlng: 		[55.369694, 64.457895]
		},
		{
			system: 		'СТД-МПК' 
			, title: 		'ст. Кыштым'
			, arrows: 		42
			, deployed_on: 	'2016-01-01'
			, deployed_by: 	'НИЛ КСА'
			, latlng: 		[55.726665, 60.55068]
		},
		{
			system: 		'ЭЦ-МПК' 
			, title: 		'ст. Кыштым'
			, notes: 		'+ переезд АПС МП-Н в 02.2013'
			, arrows: 		42
			, deployed_on: 	'2005-12-01'
			, deployed_by: 	'НИЛ КСА'
			, latlng: 		[55.726675, 60.55078]
		}
	]
	, systemInfo = [
	 	{
	 		name: 	'ЭЦ-МПК'
			, icon:   'marker-ec-mpk.png'
			, enabled: true
		},
		{
			name: 'ЭЦ-МПК-У'
			, icon: 'marker-ec-mpk-u.png'
			, enabled: true
		},
		{	
			name: 'СТД-МПК'
			, icon: 'marker-std-mpk.png'
			, enabled: true
		}
	]
	, deployMap = null;

function mkIcon (url) {
	return L.icon({ 
		iconUrl: 		url, 
		iconSize: 		[20, 32.5],
		shadowUrl: 		'marker-shadow.png',
		shadowSize: 	[30, 30],
    	shadowAnchor: 	[10, 15]
	})
}

function showDeployDate (dd) {
	var d = new Date(dd);
	return d.getMonth() + '.'+ d.getFullYear(); 
}


 
document.addEventListener("DOMContentLoaded", function(e){
	var vue = new Vue({
		el: '#app',
		data: {
		    reflist: reflist,
		    systems: systemInfo,
		},
		computed: {
			'selected': function (reflist) {
				var self = this, enabled = {};
				self.systems.forEach(function (sys) { enabled[sys.name] = sys.enabled; })
				return self.reflist.filter(function (obj) { return enabled[obj.system] })
			}
		},
		watch: {
			selected: function updateMap(reflist) {
				var self = this, icons = {}
				systemInfo.forEach(function (sinfo) {
					icons[sinfo.name] = sinfo.icon;
				})
				reflist.forEach(function (obj) {
					L.marker(obj.latlng, {icon: mkIcon(icons[obj.system]) })
						.addTo(deployMap)
			    		.bindPopup(
			    			'<b>'+obj.title+'</b>'
			    			+' '+showDeployDate(obj.deployed_on)
			    			+'<br />'+plural(obj.arrows,'стрелка', 'стрелки', 'стрелок')
			    			+(obj.notes ? ('<br />'+ obj.notes) : ''));
				});
			}
		}
	})

	deployMap = L.map('deploy-map').setView([60.187797,56.338410], 5);

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(deployMap);
})

function plural (a, str1, str2, str3) {
  	function suffix(a) {
  		if (a % 10 == 1 && a % 100 != 11 ) 
	  		return str1;
	  	else if ( a % 10 >= 2 && a % 10 <= 4 && ( a % 100 == 20)) 
	  		return str2;
	    else return str3;
  	}
  	return a + ' ' + suffix(Number(a));
}
Vue.filter('plural', plural)

Vue.filter('json', function (a) { return JSON.stringify(a) })