<template>
    <div class="vue-component-gmaps" :id="id"></div>
</template>

<script>
    export default {

        props: {
            'center': {
                type: String
            },
            'locations': {
                type: Array,
                default: function () {
                    return [];
                }
            },
            'selector': {
                type: String,
                default: ''
            },
            'id': {
                type: String,
                default: ''
            },
            'theme': {
                type: String,
                default: 'default'
            },
            'afterDrag': {
                type: Function,
                default: function () {
                    console.log('default after drag, no action');
                }
            },
            'afterDraw': {
                type: Function,
                default: function () {
                    console.log('default after draw, no action');
                }
            },
            'afterZoom': {
                type: Function,
                default: function () {
                    console.log('default after zoom, no action');
                }
            },
            'zoom': {
                type: Number,
                default: 15
            },
            'search': {},
            'infowindow': false
        },

        data: function () {
            return {
                pins: [],
                _gmap: null,
                _searchTimeout: null
            };
        },

        watch: {

            'locations': function (newLocations, oldLocations) {
                this.singletonMap();
                this.locations = newLocations;
                this.removeMarkers();
                this.markLocations();
            },

            'search': function (newModel, oldModel) {
                this.initSearch();
            }

        },

        methods: {

            setCenter: function (center) {
                this.center = center;
            },

            singletonMap: function () {
                if (this._gmap) {
                    return;
                }

                this.initMap();
            },

            prepareMapOptions: function (theme) {
                var options = settings.vue.gmaps.themes.getOptions(theme);

                /**
                 * Make center object.
                 */
                if (options.center) {
                    options.center = new google.maps.LatLng(options.center[0], options.center[1]);
                }

                return options;
            },

            /**
             * Initialize gmap and set default zoom
             */
            initMap: function () {
                this._gmap = new google.maps.Map($(this.selector)[0], this.prepareMapOptions(this.theme));

                var listener = google.maps.event.addListener(this._gmap, 'idle', function () {
                    google.maps.event.removeListener(listener);

                    /*if (typeof this.$parent.onGmapsIdle == 'function' && this.$parent.onGmapsIdle(this._gmap)) {
                     console.log("everything is set");
                     // do nothing, everything was set
                     } else if (this.pins.length == 1 || this._gmap.getZoom() > this.zoom) {
                     console.log("pins!");
                     if (this.pins.length > 0) {
                     this._gmap.setZoom(this.zoom);
                     this._gmap.setCenter(this.pins[0].position);
                     } else {
                     this.fitToDefault();
                     }
                     } else {
                     console.log("fitting");
                     this.fitBounds();
                     }*/
                    this._gmap.setOptions({minZoom: 5/*, maxZoom: 15*/});

                    this.removeMarkers();
                    this.markLocations();

                    if (this.locations.length > 0) {
                        this.fitBounds();
                    } else {
                        this.fitForNoMarkers();
                    }

                    google.maps.event.addListener(this._gmap, 'dragend', this.afterDrag);
                    google.maps.event.addListener(this._gmap, 'zoom_changed', this.afterZoom);
                }.bind(this));
            },

            fitForNoMarkers: function () {
                console.log("fitting for no markers", this.center);
                var center = this.center.split(';');
                var zoom = 7;
                var centerLatLng = new google.maps.LatLng(center[0], center[1]);

                this._gmap.setCenter(centerLatLng);
                this._gmap.setZoom(zoom);

                /*var latLngBounds = new google.maps.LatLngBounds();
                 latLngBounds.extend(centerLatLng);
                 this._gmap.fitBounds(latLngBounds);*/

                google.maps.event.trigger(this._gmap, 'resize');
            },

            fitForOneMarker: function () {
                console.log("fitting for one marker", this.locations[0].geo);
                var center = this.locations[0].geo;
                var zoom = 13;
                var centerLatLng = new google.maps.LatLng(center[0], center[1]);

                this._gmap.setCenter(centerLatLng);
                this._gmap.setZoom(zoom);

                var latLngBounds = new google.maps.LatLngBounds();
                latLngBounds.extend(centerLatLng);
                this._gmap.fitBounds(latLngBounds);

                google.maps.event.trigger(this._gmap, 'resize');
            },

            /**
             * Fit all locations in viewport
             */
            fitBounds: function () {
                if (this.pins.length == 0) {
                    this.fitForNoMarkers();
                    return;
                } else if (this.pins.length == 1) {
                    this.fitForOneMarker();
                    return;
                }

                var latLngBounds = new google.maps.LatLngBounds();

                $.each(this.pins, function (i, pin) {
                    latLngBounds.extend(pin.position);
                });

                this._gmap.fitBounds(latLngBounds);
            },

            fitToDefault: function () {
                console.log("fit to default");
                var latLngBounds = new google.maps.LatLngBounds();
                var center = this.center.split(';');
                console.log(center);
                latLngBounds.extend(new google.maps.LatLng(center[0], center[1]));
                console.log("fitting to bounds", latLngBounds);
                this._gmap.fitBounds(latLngBounds);
                google.maps.event.trigger(this._gmap, 'resize');
            },

            /**
             * Create public marker
             */
            addPublicMarker: function (position, loc) {
                var marker = new google.maps.Marker({
                    position: position,
                    map: this._gmap,
                    draggable: true,
                    //icon: '/assets/images/icons/marker.png',
                    loc: loc
                });
                this.pins.push(marker);

                google.maps.event.addListener(marker, 'dragend', function (evt) {
                    var val = evt.latLng.lat() + ';' + evt.latLng.lng();
                    this.$emit('change', val);
                    this.$emit('input', val);
                }.bind(this));

                /**
                 * @T00D00 - where is infowindow defines
                 */
                if (this.infowindow) {
                 google.maps.event.addListener(marker, 'click', function () {
                 infowindow.setContent(loc.id);
                 infowindow.setPosition(marker.position);
                 infowindow.open(this._gmap);
                 }.bind(this, marker));
                 }

                return marker;
            },

            /**
             * Remove marker from map
             */
            removeMarker: function (marker) {
                marker.setMap(null);
            },

            /**
             * Remove all markers from map
             */
            removeMarkers: function () {
                for (var i in this.pins) {
                    this.removeMarker(this.pins[i]);
                }
                //infowindow.close();
                this.pins = [];
            },

            /**
             * Get google.maps.LatLng from CMS's gmap type field
             */
            getLatLngFromCmsMap: function (geo) {
                return new google.maps.LatLng(parseFloat(geo[0]), parseFloat(geo[1]));
            },

            /**
             * Add markers for all locations
             */
            markLocations: function () {
                for (var i in this.locations) {
                    var loc = this.locations[i];
                    var position = this.getLatLngFromCmsMap(loc.geo);

                    var marker = this.addPublicMarker(position, loc);
                }

                this.afterDraw();
            },

            initSearch: function () {
                this.singletonMap();
                this.fetchsearch();
            },

            fetchsearch: function () {
                if (this.search) {
                    clearTimeout(this._searchTimeout);

                    this._searchTimeout = setTimeout(function () {
                        http.get('https://maps.googleapis.com/maps/api/geocode/json?'
                            + (Pckg && Pckg.config && Pckg.config.apis && Pckg.config.apis.googleConsole
                                ? 'key=' + Pckg.config.apis.googleConsole + '&'
                                : '')
                            + 'address=' + this.search).success(function (data) {
                            console.log('results', data);
                            if (typeof data.results != 'undefined' && data.results.length > 0) {
                                var location;

                                $.each(data.results, function (i, result) {
                                    if (result.geometry.location) {
                                        location = result.geometry.location;

                                        // break loop
                                        return false;
                                    }
                                });

                                if (location) {
                                    var geo = [location.lat, location.lng];
                                    this.locations = [{
                                        geo: geo
                                    }];
                                    this.fitBounds();
                                } else {
                                    this.fitToDefault();
                                }
                            }
                        }.bind(this));
                    }.bind(this), 333);
                } else {
                    this.$parent.updateLocation(null, null, null);
                    this.fitToDefault();
                }
            },

            getLocation: function () {
                if (this.locations.length == 0) {
                    return null;
                }

                return this.locations[0];
            }

        },

        ready: function () {
            if (typeof this.search != 'undefined') {
                this.initSearch();
            } else {
                this.initMap();
            }
        }

    }
</script>