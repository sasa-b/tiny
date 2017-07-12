# tiny
A small hash and history api router suitable for hybrid web apps which use both the SPA and traditional approach at the same time.

# API
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
