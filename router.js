/**
 * Created by Sasa B. on 25-Jul-16.
 */
var Tiny = function () {
    var thisObj = this;
    this.url = window.location.href;
    this.location = '';
    this.oldHash = '';
    this.routes = [];
    this.routeParams = [];

    this.defaultRoute = {
        "hash" : '',
        "method" : null
    };

    this.setDefaultRouteMethod = function(callback) {
        thisObj.defaultRoute.method = callback;
        thisObj.routes.push(thisObj.defaultRoute);
    }

    this.parseUrl = function() {
        var url = location.href;

        url = url.substr(7, url.length);
        url = url.split('/');

        return url;
    }

    this.setRoute = function(route, callback) {
        var pattern = /({[a-zA-z0-9]+})/g;
        if (pattern.test(route) == true) {
            var params = route.split(':');
            var hash = params[0];
                params.splice(0, 1);
            var l = params.length;
            for (var i = 0; i < l; i++) {
                params[i] = params[i].replace(/[^a-zA-z0-9]+/g, '');
            }
            var newRoute = {
                "hash" : hash,
                "method" : callback,
                "params" : params
            };
        } else {
            var newRoute = {
                "hash" : route,
                "method" : callback,
            };
        }
        thisObj.routes.push(newRoute);
    }

    this.compatMode = function() {
        var url = thisObj.parseUrl();
        var hash = thisObj.parseRoute(location.hash);

        if (hash) {
            if (thisObj.oldHash !== hash) {
                thisObj.oldHash = hash;
                thisObj.routes.forEach(function(route) {
                    if (route.hash === hash) {
                        thisObj.location = route.hash;
                        if (route.hasOwnProperty('params')) {
                            route.method(eval(thisObj.setRouteParams(route)));
                        } else {
                            route.method();
                        }
                        console.log(route);
                    }
                });
            }
        } else {
            url.forEach(function(part) {
                if (part.indexOf('#') > -1) {
                    var hash = part.substr(part.indexOf('#'), part.length);
                        hash = thisObj.parseRoute(hash);
                    console.log(hash);
                    if (thisObj.oldHash !== hash) {
                        thisObj.oldHash = hash;
                        thisObj.routes.forEach(function(route) {
                            if (route.hash === hash) {
                                thisObj.location = route.hash;
                                if (route.hasOwnProperty('params')) {
                                    route.method(eval(thisObj.setRouteParams(route)));
                                } else {
                                    route.method();
                                }
                                console.log(route);
                            }
                        });
                    }

                }
            });
        }
    }

    this.parseRoute = function(route) {
        if (route.indexOf(':') > -1) {
            var params = route.split(':');
            var hash = params[0];
            params.splice(0, 1);

            thisObj.routeParams = params;

            return hash;
        }

        return route;
    }

    this.setRouteParams = function(route) {

        var routeParams = thisObj.routeParams;
        thisObj.routeParams = {};
        var i = 0;
        var args = '';

        route.params.forEach(function (key) {
            thisObj.routeParams[key] = routeParams[i];
            args += 'thisObj.routeParams.' + key + ', ';
            i++;
        });

        args = args.replace(/(,\s){1}$/, '');

        return args;
    }

    this.listen = function() {

       if ("onhashchange" in window) {
            window.onhashchange = function() {

                var hash = thisObj.parseRoute(location.hash);

                thisObj.routes.forEach(function(route) {
                    if (route.hash === hash) {
                        thisObj.location = route.hash;
                        if (route.hasOwnProperty('params')) {
                            route.method(eval(thisObj.setRouteParams(route)));
                        } else {
                            route.method();
                        }
                        console.log(route);
                    }
                });
            }
        } else {
            window.setInterval(thisObj.compatMode, 100);
        }
    }

    this.onPageLoad = function() {
        var hash = thisObj.parseRoute(location.hash);
        thisObj.location = hash;

        if (!hash && hash != '') {
            var url = thisObj.parseUrl();
            console.log(url);
            url.forEach(function(part) {
                if (part.indexOf('#') > -1) {
                    var hash = part.substr(part.indexOf('#'), part.length);
                    hash = thisObj.parseRoute(hash);
                    thisObj.oldHash = hash;
                    console.log(hash);

                    thisObj.routes.forEach(function(route) {
                        if (route.hasOwnProperty('params')) {
                            route.method(eval(thisObj.setRouteParams(route)));
                        } else {
                            route.method();
                        }
                    });

                }
            });
            return false;
        }

        thisObj.routes.forEach(function(route) {
            if (route.hash === hash) {
                if (route.hasOwnProperty('params')) {
                    route.method(eval(thisObj.setRouteParams(route)));
                } else {
                    route.method();
                }
            }
        });

    }

    window.addEventListener('DOMContentLoaded', function() {
        console.log('onLoad - hashevent');
        thisObj.onPageLoad();
    });

}
