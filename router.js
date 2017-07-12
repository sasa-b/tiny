function Router(config) {
    var self = this;

    var routes = {
        hash: [],
        url: []
    };

    var actions = {};

    var patterns = {
        hash: [],
        url: []
    };

    var matchedHash = "";

    this.defaultHashAction = null;

    this.className = 'push-state';

    this.trimSlashes = function(string) {
        return string.replace(/^\/+/, '').replace(/\/+$/, '');
    }

    var parseRoute = function (hash) {
        hash = self.trimSlashes(hash);
        hash = hash.replace('/', '\/');
        hash = hash.replace(/\{\w+\}/g, '([a-zA-Z0-9-]+)');
        return '^' + hash + '$';
    }

    var getParams = function(matches) {
        delete matches['index'];
        delete matches['input'];
        return matches.slice(1, matches.length);
    }

    var pushState = function (state, path) {
        history.pushState(state ? state : null, state && state.hasOwnProperty('title') ? state.title : document.title, path);
        var event = new Event("popstate");
            event.state = state;
        window.dispatchEvent(event);
    }

    this.getPath = function(){
        var location = window.location.href.replace(/\/+$/, '').split('//')[1].split('/');
        return location.slice(1, location.length).join("/");
    }

    this.addHash = function (route, callback) {
        routes.hash.push(route);

        var pattern = parseRoute(route);
            patterns.hash.push(pattern);

        actions[pattern] = callback;
        return this;
    }

    this.addRoute = function(route, callback) {
        routes.url.push(route);

        var pattern = parseRoute(route.replace(/#+$/, ''));
            patterns.url.push(pattern);

        actions[pattern] = callback;
        return this;
    }

    this.getRoutes = function () {
        return routes;
    }

    this.getRoute = function (key) {
        try {
            if (typeof key === 'number') {
                return routes.url[key];
            } else {
                var l = routes.url.length;
                for (var i = 0; i < l; i++) {
                    if (key === routes.url[i]) {
                        return routes.url[i];
                    }
                }
            }
        } catch (e) {
            return null;
        }
    }

    this.getHashRoute = function (key) {
        try {
            if (typeof key === 'number') {
                return routes.hash[key];
            } else {
                var l = routes.hash.length;
                for (var i = 0; i < l; i++) {
                    if (key === routes.hash[i]) {
                        return routes.hash[i];
                    }
                }
            }
        } catch (e) {
            return null;
        }
    }

    this.getRouteAction = function(route) {
        return actions[parseRoute(route)];
    }

    this.hashMatch = function () {
        if (window.location.hash === "") {
            if (this.defaultHashAction) {
                this.defaultHashAction();
            }
            return true;
        }

        var l = patterns.hash.length;
        for (var i = 0; i < l; i++) {
            var matches = window.location.hash.match(new RegExp(patterns.hash[i]));
            if (matches) {
                actions[patterns.hash[i]].apply(this, getParams(matches));
                return true;
            }
        }
        return false;
    }

    this.hashMatchCompatMode = function() {
        if (window.location.hash !== matchedHash) {
            if (self.hashMatch()) {
                matchedHash = window.location.hash;
            }
        }
    }

    this.urlMatch = function () {
        var l = patterns.url.length;
        for (var i = 0; i < l; i++) {
            var matches = self.getPath().match(new RegExp(patterns.url[i]));
            console.log(self.getPath(), patterns.url[i]);
            if (matches) {
                actions[patterns.url[i]].apply(this, getParams(matches));
                return true;
            }
        }
        return false;
    }
    
    this.listen = function () {
        if ("onhashchange" in window) {
            window.onhashchange = self.hashMatch;
        } else {
            window.setInterval(self.hashMatchCompatMode, 150);
        }

       try {
           window.addEventListener('popstate', function(e) {
               if (self.urlMatch()) {
                   e.preventDefault();
               }
           });
       } catch (e) {
           throw new Error("Browser does not support History Api, please update your browser.");
       }
    }

    var construct = function (config) {
        if (config && config.hasOwnProperty('hybrid') && config['hybrid'] === true) {
            var a = document.getElementsByClassName(self.className);
            var l = a.length;
            for (var i = 0; i < l; i++) {
                a[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    pushState(this.dataset.pushState, this.href);
                });
            }
        } else {
            var a = document.getElementsByTagName('a');
            var l = a.length;
            for (var i = 0; i < l; i++) {
                a[i].addEventListener('click', function (e) {
                    if (this.href.indexOf('#') > 0) {
                        e.preventDefault();
                        pushState(this.dataset.pushState, this.href);
                    }
                });
            }
        }
    }(config);

    window.addEventListener('load', function () {
        self.urlMatch();
        self.hashMatch();
    });
}
