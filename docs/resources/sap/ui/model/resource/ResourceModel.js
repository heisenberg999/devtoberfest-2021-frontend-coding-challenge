/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/BindingMode","sap/ui/model/Model","./ResourcePropertyBinding","sap/base/i18n/ResourceBundle","sap/base/Log"],function(e,n,t,i,o){"use strict";var r=n.extend("sap.ui.model.resource.ResourceModel",{constructor:function(t){n.apply(this,arguments);this.aCustomBundles=[];this.bReenhance=false;this.bAsync=!!(t&&t.async);this.sDefaultBindingMode=t.defaultBindingMode||e.OneWay;this.mSupportedBindingModes={OneWay:true,TwoWay:false,OneTime:!this.bAsync};if(this.bAsync&&this.sDefaultBindingMode==e.OneTime){o.warning("Using binding mode OneTime for asynchronous ResourceModel is not supported!")}this.oData=t;if(t&&t.bundle){this._oResourceBundle=t.bundle}else if(t&&(t.bundleUrl||t.bundleName)){s(this)}else{throw new Error("At least bundle, bundleName or bundleUrl must be provided!")}if(t&&Array.isArray(t.enhanceWith)&&t.enhanceWith.length>0){if(this.bAsync){this._pEnhanced=t.enhanceWith.reduce(function(e,n){return e.then(this.enhance.bind(this,n))}.bind(this),Promise.resolve())}else{t.enhanceWith.forEach(this.enhance.bind(this))}}}});r.loadResourceBundle=function(e,n){var t=sap.ui.getCore().getConfiguration(),o=e.bundleLocale;if(!o){o=t.getLanguage()}return i.create({async:n,includeInfo:t.getOriginInfo(),locale:o,url:u(e.bundleUrl,e.bundleName)})};r.prototype.enhance=function(e){var n=this,t,o=this.bAsync?new Promise(function(e){t=e}):null;function s(){if(e instanceof i){n._oResourceBundle._enhance(e);n.checkUpdate(true);if(o){t(true)}}else{var s=r.loadResourceBundle(e,n.bAsync);if(s instanceof Promise){s.then(function(e){n._oResourceBundle._enhance(e);n.checkUpdate(true);t(true)},function(){t(true)})}else if(s){n._oResourceBundle._enhance(s);n.checkUpdate(true)}}}if(this._oPromise){Promise.resolve(this._oPromise).then(s)}else{s()}if(!this.bReenhance){this.aCustomBundles.push(e)}return o};r.prototype.bindProperty=function(e){return new t(this,e)};r.prototype.getProperty=function(e){return this._oResourceBundle?this._oResourceBundle.getText(e):null};r.prototype.getResourceBundle=function(){if(!this.bAsync){return this._oResourceBundle}else{var e=this._oPromise;if(e){return new Promise(function(n,t){function i(e){n(e)}e.then(i,i)})}else{return Promise.resolve(this._oResourceBundle)}}};r.prototype._handleLocalizationChange=function(){s(this)};r.prototype._reenhance=function(){this.bReenhance=true;this.aCustomBundles.forEach(function(e){this.enhance(e)}.bind(this));this.bReenhance=false};function s(e){var n=e.oData;if(n&&(n.bundleUrl||n.bundleName)){var t=r.loadResourceBundle(n,n.async);if(t instanceof Promise){var i={url:u(n.bundleUrl,n.bundleName),async:true};e.fireRequestSent(i);e._oPromise=t;e._oPromise.then(function(n){e._oResourceBundle=n;e._reenhance();delete e._oPromise;e.checkUpdate(true);e.fireRequestCompleted(i)})}else{e._oResourceBundle=t;e._reenhance();e.checkUpdate(true)}}}function u(e,n){var t=e;if(n){if(/^\/|^\./.test(n)){o.error('Incorrect resource bundle name "'+n+'"',"Leading slashes or dots in resource bundle names are ignored, since such names are"+' invalid UI5 module names. Please check whether the resource model "'+n+'" is actually needed by your application.',"sap.ui.model.resource.ResourceModel");n=n.replace(/^(?:\/|\.)*/,"")}n=n.replace(/\./g,"/");t=sap.ui.require.toUrl(n)+".properties"}return t}return r});