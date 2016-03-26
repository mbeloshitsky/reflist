var deployMap = null;
var pruneCluster = new PruneClusterForLeaflet();

pruneCluster.BuildLeafletClusterIcon = function(cluster) {
    var e = new L.Icon.MarkerCluster();

    e.stats = cluster.stats;
    e.population = cluster.population;
    return e;
};

L.Icon.MarkerCluster = L.Icon.extend({
    options: {
        iconSize: new L.Point(48, 48),
        className: 'prunecluster leaflet-markercluster-icon'
    },

    createIcon: function () {
        // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
        var e = document.createElement('canvas');
        this._setIconStyles(e, 'icon');
        var s = this.options.iconSize;
        e.width = s.x;
        e.height = s.y;
        this.draw(e.getContext('2d'), s.x, s.y);
        return e;
    },

    createShadow: function () {
        return null;
    },

    draw: function(canvas, width, height) {
        canvas.beginPath();
        canvas.fillStyle = 'white';
        canvas.arc(24, 24, 16, 0, Math.PI*2);
        canvas.fill();
        canvas.closePath();

        var a = 0;
        for (var i in systemInfo) {
            var size = this.stats[i] / this.population
              , sector_a = Math.PI*2/6;
            if (size > 0) {
            	a += 1
            	canvas.beginPath();
            	canvas.moveTo(24,24);
				canvas.arc(24,24, 24, sector_a*a, sector_a*(a+1));
				canvas.lineTo(24,24);
                canvas.fillStyle = systemInfo[i].color;
                canvas.fill();
                canvas.closePath();

                /* canvas.beginPath();

                var angle = Math.PI/4*a;
                var posx = Math.cos(angle) * 18, posy = Math.sin(angle) * 18;


                var xa = 0, xb = 1, ya = 4, yb = 8;

                // var r = ya + (size - xa) * ((yb - ya) / (xb - xa));
                var r = ya + size * (yb - ya);

                //canvas.moveTo(posx, posy);
                canvas.arc(24+posx,24+posy, r, 0, Math.PI*2);
                canvas.fillStyle = systemInfo[i].color;
                canvas.fill();
                canvas.closePath(); */
            }
        }

        
        canvas.fillStyle = '#555';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';
        canvas.font = 'bold 12px sans-serif';

        canvas.fillText(this.population, 24, 24, 48);
    }
});





/* function iconName(systems) {
	var compositeName = systems
		.map(function (sys) { return systemInfo[sys].icon })
		.join('-');
	return 'marker-'+compositeName+'.png'
}


function mkIcon (systems) {
	return L.icon({ 
		iconUrl: 		iconName(systems), 
		iconSize: 		[20, 32.5],
		shadowUrl: 		'marker-shadow.png',
		shadowSize: 	[30, 30],
    	shadowAnchor: 	[10, 15]
	})
} */

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
				var self = this;
				function hasEnabled (obj) {
					return obj
						.systems
						.filter(function (sys) { 
							return self.systems[sys].enabled; 
						}).length > 0;
				}
				return self.reflist.filter(hasEnabled)
			}
		},
		watch: {
			selected: function updateMap(reflist) {
				pruneCluster.RemoveMarkers();
				var self = this
				return;
				/* L.marker(obj.latlng, {icon: mkIcon(obj.systems) })
				.addTo(deployMap)
	    		.bindPopup(
	    			'<b>'+obj.title+'</b>'
	    			+' '+showDeployDate(obj.deployed_on)
	    			+'<br />'+obj.systems.join(' + ')
	    			+'<br />'+plural(obj.arrows,'стрелка', 'стрелки', 'стрелок')
	    			+(obj.notes ? ('<br />'+ obj.notes) : '')); */

			}
		}
	})

	deployMap = L.map('deploy-map').setView([60.187797,56.338410], 5);

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(deployMap);

	deployMap.addLayer(pruneCluster);

	reflist.forEach(function (obj) {
		obj.systems.forEach(function (sys) {
			var marker = new PruneCluster.Marker(obj.latlng[0], obj.latlng[1]);
			marker.category = sys;
			pruneCluster.RegisterMarker(marker);						
		})
	});

	pruneCluster.ProcessView();

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

Vue.filter('join', function (values) { return values.join(', ') })

Vue.filter('icon', function (values) { 
	if (values.map === undefined)
		values = [values];
	return iconName(values);
})