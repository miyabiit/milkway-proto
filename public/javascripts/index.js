		/**
		* Callback function: update #lat and #lng element value
		*/
		function updateLatLng(map){
			latlng = map.getCenter();
			$('#lat').text(latlng.lat());
			$('#lng').text(latlng.lng());
		}

		/**
		* Callback function for an 'init' event of Google Map
		*/
		function gmap_init(){
			var mapOptions = {
				zoom: 15,
				center: new google.maps.LatLng(35.6903, 139.7006),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
			};

			var marker;
			var map = new google.maps.Map($('#map-canvas')[0], mapOptions);

			//add event listener 地図の中心が変わった時
			google.maps.event.addListener(map, 'center_changed', function() {
				updateLatLng(map);
			});
			//add event listener クリックしたとき
			google.maps.event.addListener(map, 'click', function(event) {
				if(marker){marker.setMap(null)};
				marker = new google.maps.Marker({
					position: event.latLng,
					draggable: true,
					map: map
				});
				infotable(marker.getPosition().lat(), marker.getPosition().lng(), map.getZoom());
				geocode();
				google.maps.event.addListener(marker, 'dragend', function(event) {
					infotable(maker.getPosition().lat(), marker.getPosition().lng(), map.getZoom());
					geocode();
				});
				google.maps.event.addListener(map, 'zoom_changed', function(event) {
					infotable(marker.getPosition().lat(), marker.getPosition().lng(), map.getZoom());
				});
			});
			//ジオコーディング
			function geocode(){
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode(
					{'location': marker.getPosition()},
					function(results, status) {
						if(status == google.maps.GeocoderStatus.OK && results[0]){
							$("#id_address").text(results[0].formatted_address);
						}else{
							$("#id_address").text("GeoCode取得に失敗しました");
						}
					}
				);
			};

			function infotable(ido, keido, label){
				$('#id_ido').text(ido);
				$('#id_keido').text(keido);
				$('#id_label').text(label);
			};

			updateLatLng(map);
		}

		/**
		* Load Google Map Asynchronously
		*/

		function load_gmap_async() {
			window.gmap_init = gmap_init;

			// Asynchronously load Google Map
			var api_key = 'AIzaSyBT-2YQYjeiXbMIO8vbdhTeYW7i2FrM9-4';
			var params = $.param({key: api_key, sensor: 'true', callback: 'gmap_init'});
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'http://maps.googleapis.com/maps/api/js?' + params;
			document.body.appendChild(script);
		}

		load_gmap_async();

