# Tiny
A small hash and history api router suitable for hybrid web apps which use both the SPA and traditional approach at the same time.

## API / USAGE EXAMPLES
```javascript
var router = new Router();
```
or
```javascript
var router = new Router({hybrid:true});
```
In the second example the router will only work for links with push-state class. 
```html
<a href="/awesome" class="push-state" data-push-state='{"title":"Awesome","foo":"bar"}'>Click me</a>
```

Adding routes
```javascript
router.addHash('#foo', function() {
    //Do something
});

router.addRoute('/foo', function() {
  //Do something
});
```

Adding routes with variables
```javascript
router.addHash('#foo/{bar}', function(bar) {
    //Do something
});

router.addRoute('/foo/{bar}', function(bar) {
  //Do something
});
```

Turning the listeners (router) on
```javascript
router.listen();
```

Set a default action for empty hash
```javascript
router.defaultHashAction = function() {
    //Do something
};
```

Getters
```javascript
router.getRoutes();

router.getRoute(0);
router.getRoute('/foo');

router.getRouteAction(router.getRoute(0));
```
