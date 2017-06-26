# jsLoader
jsLoader for browser.dynamic load js

## EASY TO USE
```javascript

JsLoader.load(file:string [,onSuccess,onError]);

JsLoader.loadFiles(file:string || files:array
 [onFinish,onSuccess,onError])


/*example*/
JsLoader.loadFiles('./test1.js');
JsLoader.loadFiles(['./test2.js','./test1.js']);
JsLoader.load('https://some.place.net/xxx.js');

```

## cache

JsLoader wont reload the files which has already loaded.

- `some.js` & `some.js?v1.0` & `some.js?v1.2` will be regard as same file


## safety

JsLoader wont allow the different origin file to be loaded

If you want to cancel this limit, Just set 
```javascript
JsLoader.allowCrosArg = true;
```

## Browser support & dependencies

This script does not require any library, since it is written in native javascript. It should work on all popular browsers (including the ancient IE6 :))