!function(){"use strict";angular.module("lendbitcoin",["ngCookies","ui.router","percentage","xeditable"]).config(["$stateProvider","$urlRouterProvider",function(e,t){e.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"}).state("address",{url:"/{address:r[\\w]{33}}",templateUrl:"app/main/main.html",controller:"MainCtrl"}),t.otherwise("/")}]),angular.module("lendbitcoin").service("_",["$window",function(e){return e.window._}]),angular.module("lendbitcoin").service("RB",["$window",function(e){return e.window.rippleBonds}])}(),function(){"use strict";function e(e,t,n,r,o){o.isUndefined(t.address)||(r.acc=t.address),e.rb=n,e.setOrderTemplate=function(t,n){o.isUndefined(t.b)?o.isUndefined(t.t)&&(t.t=!1):(t.p="b"===n?t.b:t.a,t.t="b"===n),e.preset=t},e.preset={},e.predicate="b",e.reverse=!1,e.filter={}}e.$inject=["$scope","$stateParams","RB","Account","_"],angular.module("lendbitcoin").controller("MainCtrl",e)}(),function(){"use strict";angular.module("lendbitcoin").constant("FED","rQpCfAsbZFRwH53aoVqzKFcXuq6wnukQCL")}(),function(){"use strict";function e(e,t){return{templateUrl:"app/account/account.balance.directive.tpl.html",restrict:"E",controller:["$scope",function(n){e.updateBalances(),t.$on("balance:update",function(){n.balances=e.getBalances(),t.$apply()})}]}}e.$inject=["Platform","$rootScope"],angular.module("lendbitcoin").directive("accountBalance",e)}(),function(){"use strict";function e(e,t,n){return{templateUrl:"app/account/account.directive.tpl.html",restrict:"E",scope:{},controller:["$scope",function(r){r.$watch("user.acc",function(t,o){t!==o&&(e.acc=t,r.isSecretSet=!1,n.$broadcast("account:change"))}),r.setSecret=function(e){t.setSecret(e),r.user.secret="",r.isSecretSet=!0},r.user={acc:e.acc}}]}}e.$inject=["Account","Ripple","$rootScope"],angular.module("lendbitcoin").directive("account",e)}(),function(){"use strict";function e(e,t){var n="";this.__defineGetter__("acc",function(){return n||e.get("acc")}),this.__defineSetter__("acc",function(t){var r=t.match(/r[\w]{33}/);return r[0]?(n=r[0],e.put("acc",n),!0):!1}),this.addIssuer=function(n,r){var o=e.get("AddressBook");t.isUndefined()&&(o={}),o[n]=r,e.put("AddressBook",o)},this.removeIssuer=function(t){var n=e.get("AddressBook");delete n[t],e.put("AddressBook",n)},this.getAddressBook=function(){return e.get("AddressBook")},this.addFavBond=function(n){var r=e.get("Favs");r||(r={bonds:[]});var o=t.pick(n,["i","s"]);t.find(r.bonds,o)||r.bonds.push(o),e.put("Favs",r)},this.removeFavBond=function(n){var r=e.get("Favs");r.bonds=t.remove(r.bonds,t.pick(n,["i","s"])),e.put("Favs",r)},this.getFavBonds=function(){var t=e.get("Favs");return t?t.bonds:[]}}e.$inject=["$cookieStore","_"],angular.module("lendbitcoin").service("Account",e)}(),function(){"use strict";function e(e,t){return{templateUrl:"app/positions/positions.directive.tpl.html",restrict:"E",controller:["$scope",function(n){t.$on("balance:update",function(){n.positions=e.getPositions()})}]}}e.$inject=["Platform","$rootScope"],angular.module("lendbitcoin").directive("positions",e)}(),function(){"use strict";function e(e,t){return{templateUrl:"app/watchlist/watchlist.directive.tpl.html",restrict:"E",controller:["$scope",function(n){function r(){n.bonds=e.getBonds(),t.$apply()}t.$on("bond:update",r),t.$on("bond:new",r)}]}}e.$inject=["Platform","$rootScope"],angular.module("lendbitcoin").directive("watchlist",e)}(),angular.module("lendbitcoin").directive("orders",["Platform","$rootScope",function(e,t){return{templateUrl:"app/orders/orders.directive.tpl.html",restrict:"E",controller:["$scope",function(n){t.$on("order:update",function(){n.orders=e.getOrders(),t.$apply()}),e.updateOrders(),n.cancelOrder=e.cancelOrder}]}}]),angular.module("lendbitcoin").directive("bondsExpire",function(){return{template:"{{expMonth|date:dtFormat}} ({{daysLeft}} days)",restrict:"E",scope:{date:"@"},controller:["$scope",function(e){var t=new Date(e.date.replace(/"/g,""));e.expMonth=new Date(t.getTime()-1);var n=new Date,r=new Date(n.getTime()+60*n.getTimezoneOffset()*1e3);e.daysLeft=Math.round((t.getTime()-r)/24/60/60/1e3),e.dtFormat=e.daysLeft>=365?"MMM y":"MMM"}]}}),function(){"use strict";function e(e,t){return{template:'<a ng-click="toggleFav()">{{isFav}}</a>',restrict:"E",scope:{bond:"="},controller:["$scope",function(n){var r=e.getFavBonds(),o=t.pick(n.bond,["i","s"]);n.isFav=Boolean(t.find(r,o)),n.toggleFav=function(){n.isFav?e.removeFavBond(o):e.addFavBond(o),n.isFav=!n.isFav}}]}}e.$inject=["Account","_"],angular.module("lendbitcoin").directive("bondsFavourite",e)}(),function(){"use strict";function e(e,t){return{templateUrl:"app/platform/platform.buysell.directive.tpl.html",restrict:"E",scope:!1,controller:["$scope",function(n){n.$watch("preset",function(e){n.order=angular.copy(e),n.order.t=String(n.order.t)},!0),t.$on("bond:new",function(){n.issuers=e.getIssuers()}),n.makeOrder=function(){var t={i:n.order.i,s:n.order.s,t:Boolean(+n.order.t),v:+n.order.v,p:+n.order.p};e.makeOrder(t,function(e){e&&console.log("Platform.makeOrder - fail",e)})}}]}}e.$inject=["Platform","$rootScope"],angular.module("lendbitcoin").directive("buysell",e)}(),function(){"use strict";function e(e){return{templateUrl:"app/platform/platform.symbol.add.directive.tpl.html",restrict:"E",scope:!1,controller:["$scope",function(t){t.addSymbol=function(){if(angular.isDefined(t.symbol.str)){var n=t.symbol.str.split(":");e.addSymbol({i:n[0],s:n[1].toUpperCase()})}else t.symbol.s.toUpperCase(),e.addSymbol(t.symbol)}}]}}e.$inject=["Platform"],angular.module("lendbitcoin").directive("platformSymbolAdd",e)}(),function(){"use strict";function e(e,t,n,r,o,i){function c(e,t){f=t,i.$broadcast("order:update")}function a(e,t){d(t),i.$broadcast("bond:update")}function s(e,t){r(t).forEach(d),i.$broadcast("balance:update")}function d(e){if(!e.i||!e.s||"XRP"===e.s)return console.log("updateSymbol - Invalid symbol supplied",e),!1;var t=r.findIndex(p,function(t){return!(e.i!==t.i||e.s!==t.s)});if(-1!==t)r.assign(p[t],e),console.log("Updating",e);else{var c=o.isSymbol(e.s),a=o.isCurrency(e.s);if(!c&&!a)return void console.log("updateSymbol - new - Invalid symbol supplied");var s={v:0,b:0,a:0};c&&(s.e=o.getExpDate(e.s),n.watchBidAsk(e)),r.defaults(e,s),p.push(e),i.$broadcast("bond:new")}}function u(e){c(null,r.reject(f,{id:e}))}var l=this,p=[],f=[];i.$on("bond:price",a),i.$on("order:change",c),i.$on("balance:change",s),i.$on("account:change",function(){p=[],n.getBalances(),n.updateOrders()}),angular.forEach(o.currencies,function(t){d({i:e,s:t})}),angular.forEach(t.getFavBonds(),d),this.addSymbol=d,this.getIssuers=function(){return r(p).map("i").uniq().value()},this.updateBalances=n.getBalances,this.updateOrders=n.updateOrders,this.getBalances=function(){return r(p).filter(function(t){return t.i===e&&0!==t.v&&o.isCurrency(t.s)}).value()},this.getBonds=function(){return r(p).filter("e").value()},this.getPositions=function(){return r(p).filter("v").filter("e").value()},this.getOrders=function(){return f},this.makeOrder=function(r,i){if(!n.isSecretSet())return i("Secret not set");var c=n.transaction(),a=o.currencyCodes[r.s[0]],s=(r.v*r.p).toFixed(4)+a,d=r.v.toFixed(4)+r.s,u=n.Amount.from_human(s).set_issuer(e),p=n.Amount.from_human(d).set_issuer(r.i),f=r.t?{from:t.acc,expiration:r.e,flag:r.f,buy:p,sell:u}:{from:t.acc,expiration:r.e,flag:r.f,buy:u,sell:p};c.offerCreate(f),c.submit(function(e,t){return i?e?i(e):"tesSUCCESS"!==t.engine_result?i(t):(i(e,t.tx_json.Sequence),void l.updateOrders()):console.log(e,t)})},this.cancelAllOrders=function(e,t,n,o){for(var i=[],c=0;c<arguments.length;c++)i.push(arguments[c]);r.isFunc(i[i.length-1])&&(o=i.pop()),e=0!==i.length?i.shift():null,t=0!==i.length?i.shift():null,n=0!==i.length?i.shift():null;var a={};r.isObject(e)?a=e:(e&&(a.i=e),t&&(a.s=t),r.isUndefined(n)||(a.t=n))},this.cancelOrder=function(e,r){if(!n.isSecretSet())return r?r("Set secret"):console.error("Set secret");var o=n.transaction();o.offerCancel(t.acc,e),o.submit(function(t,n){return"tesSUCCESS"===n.engine_result?u(e):t=n,r?r(t?t:null):null})}}e.$inject=["FED","Account","Ripple","_","RB","$rootScope"],angular.module("lendbitcoin").service("Platform",e)}(),function(){"use strict";function e(e,t,n,r,o,i){var c,a=e.window.ripple,s=a.Remote,d=new s({trusted:!0,local_signing:!0,local_fee:!0,fee_cushion:1.5,servers:[{host:"s-east.ripple.com",port:443,secure:!0},{host:"s-west.ripple.com",port:443,secure:!0}]});d.connect(),this.setSecret=function(e){d.set_secret(n.acc,e),c=!0},this.isSecretSet=function(){return c},this.watchBidAsk=function(e){function n(e,t){return"bid"===t?"undefined"==typeof e.TakerGets.issuer?(e.TakerGets/e.TakerPays.value/1e6).toFixed(3):(e.TakerGets.value/e.TakerPays.value).toFixed(3):"undefined"==typeof e.TakerPays.issuer?(e.TakerPays/e.TakerGets.value/1e6).toFixed(3):(e.TakerPays.value/e.TakerGets.value).toFixed(3)}function r(e){var t="bid"===e?{issuer_pays:l.issuer,currency_pays:l.currency,issuer_gets:p.issuer,currency_gets:p.currency}:{issuer_pays:p.issuer,currency_pays:p.currency,issuer_gets:l.issuer,currency_gets:l.currency};c(e);var n=d.book(t);n.on("transaction",function(){c(e)})}function c(e){var t="bid"===e?{gets:p,pays:l}:{gets:l,pays:p};d.requestBookOffers(t,a(e))}function a(e){return function(t,r){if(!t){var o="undefined"!=typeof r.offers[0]?n(r.offers[0],e):0,c="bid"===e?{i:s,s:u,b:+(+o).toFixed(4)}:{i:s,s:u,a:+(+o).toFixed(4)};i.$broadcast("bond:price",c)}}}var s=e.i,u=e.s,l={currency:u,issuer:s},p={currency:o.currencyCodes[u[0]],issuer:t};angular.forEach(["bid","ask"],r)},this.getBalances=function(){d.request_account_lines(n.acc,function(e,t){if(e)return void console.log("request_account_lines error - ",e);var n=r(t.lines).filter(function(e){return o.isSymbol(e.currency)||r.indexOf(o.currencies,e.currency)>-1}).map(function(e){return{i:e.account,s:e.currency,v:+(+e.balance).toFixed(3)}}).value();i.$broadcast("balance:change",n)})},this.transaction=function(){return d.transaction()},this.Amount=a.Amount,this.updateOrders=function(){function e(e){var n,r;return n=e.taker_gets,r=e.taker_pays,n.issuer===t&&o.isCurrency(n.currency)&&o.isSymbol(r.currency)||r.issuer===t&&o.isCurrency(r.currency)&&o.isSymbol(n.currency)}d.requestAccountOffers(n.acc,function(n,c){if(n)return void console.log("Ripple - updating orders failed",n);var a=r(c.offers).filter(e).map(function(e){var n={},r=e.taker_gets,i=e.taker_pays;return n.id=e.seq,n.t=o.isCurrency(r.currency),n.i=n.t?i.issuer:r.issuer,n.s=r.issuer!==t?r.currency:i.currency,n.p=n.t?+r.value/+i.value:+i.value/+r.value,n.p=+n.p.toFixed(4),n.v=n.t?+i.value:+r.value,n.v=+n.v.toFixed(4),n}).value();console.log("Orders",a),i.$broadcast("order:change",a)})}}e.$inject=["$window","FED","Account","_","RB","$rootScope"],angular.module("lendbitcoin").service("Ripple",e)}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/account/account.balance.directive.tpl.html",'<div ng-hide="balances">Zero balance</div><span ng-repeat="curr in balances"><strong>{{curr.s}}</strong>: {{curr.v|number:2}}</span>')}])}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/account/account.directive.tpl.html",'<div class="col-md-6">Account: <a href="#" editable-text="user.acc">{{ user.acc || \'Your ripple address here...\' }}</a></div><div class="col-md-6" ng-if="!isSecretSet">Password : <input type="text" ng-model="user.secret"> <button ng-click="setSecret(user.secret)">Set secret</button></div>')}])}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/main/main.html",'<div class="container-fluid"><div class="pull-left"><div><account-balance></account-balance></div></div><div class="pull-right"><account></account></div></div><div class="container-fluid"><div class="pull-right"><div><platform-symbol-add></platform-symbol-add></div><div id="tradetab"><buysell preset="preset"></buysell></div><div id="positions"><positions></positions></div><div id="orders"><orders cb="reloadCb"></orders></div></div><div><watchlist></watchlist></div></div>')}])}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/orders/orders.directive.tpl.html",'Orders:<table><thead><tr><th>Id</th><th>Issuer</th><th>Symbol</th><th>Type</th><th>Price</th><th>Size</th></tr></thead><tbody><tr ng-repeat="order in orders" ng-click="setOrderTemplate(order)"><td ng-dblclick="cancelOrder(order.id)">{{order.id}}</td><td>{{order.i}}</td><td>{{order.s}}</td><td>{{order.t ? \'buy\' : \'sell\'}}</td><td>{{order.p}}</td><td>{{order.v}}</td></tr></tbody></table>')}])}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/platform/platform.buysell.directive.tpl.html",'<div><select ng-model="order.i" ng-options="i as i for i in issuers"></select><br>Symbol: <input type="text" ng-model="order.s"><br>Type: BUY <input type="radio" ng-model="order.t" value="1"> SELL <input type="radio" ng-model="order.t" value="0"><br>Size: <input type="text" ng-model="order.v"><br>Price: <input type="text" ng-model="order.p"><br><button ng-click="makeOrder()">Send order</button></div>')}])}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/platform/platform.symbol.add.directive.tpl.html",'<div><select ng-model="symbol.i" ng-options="i as i for i in issuers"></select><br>Symbol: <input type="text" ng-model="symbol.s"><br>OR<br>Issuer:symbol : <input type="text" ng-model="symbol.str"><br><button ng-click="addSymbol()">Add symbol</button></div>')}])}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/positions/positions.directive.tpl.html",'Positions:<table><thead><tr><th>Issuer</th><th>Symbol</th><th>Size</th></tr></thead><tbody><tr ng-repeat="row in positions" ng-click="setOrderTemplate(row)"><td>{{row.i}}</td><td>{{row.s}}</td><td>{{row.v}}</td></tr></tbody></table>')}])}(),function(e){try{e=angular.module("lendbitcoin")}catch(t){e=angular.module("lendbitcoin",[])}e.run(["$templateCache",function(e){e.put("app/watchlist/watchlist.directive.tpl.html",'<table><thead><tr><th>Fav</th><th>Issuer</th><th>Symbol</th><th>Size</th><th>Expiration</th><th>Bid</th><th>Bid YTM</th><th>Ask</th><th>Ask YTM</th></tr></thead><tbody><tr ng-repeat="bond in bonds track by bond.i + bond.s | filter:filter | orderBy:predicate:reverse"><td><bonds-favourite bond="bond"></bonds-favourite></td><td>{{bond.i}}</td><td>{{bond.s}}</td><td>{{bond.v}}</td><td><bonds-expire date="{{bond.e}}"></bonds-expire></td><td ng-click="setOrderTemplate(bond,\'b\')">{{bond.b}}</td><td>{{rb.YTMNowSymbol(bond.s,bond.b)|percentage}}</td><td ng-click="setOrderTemplate(bond,\'a\')">{{bond.a}}</td><td>{{rb.YTMNowSymbol(bond.s,bond.a)|percentage}}</td></tr></tbody></table>')}])}();