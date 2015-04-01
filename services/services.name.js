
/*Name and additional information services*/

(function() {
	'use strict';

	angular
		.module('services')
		.factory('DAL', DAL);

	function DAL() {
		var dal = {};           // service object, store all services
		var _object_store = {}; // store link to database objectStore
		var contentExpItem = [];

		// open database
		dal.open = function(callback) {
			var request = indexedDB.open("investorDB", 7);

			request.onupgradeneeded = function(e) {
				var db = e.target.result;

				var collections = ["fullName", "experience", "profile", "investment"];

				/*for(var i = 0; i < db.objectStoreNames.length; i++) {
					console.log(collections[i]);
					console.log(db.objectStoreNames.contains(collections[i]));
					if(db.objectStoreNames.contains(collections[i]))
						db.deleteObjectStore(collections[i]);
				};*/

				if(db.objectStoreNames.contains("experience")) {
		        	db.deleteObjectStore("experience");
		        };

		        if(db.objectStoreNames.contains("fullName")) {
		        	db.deleteObjectStore("fullName");
		        };

		        if(db.objectStoreNames.contains("profile")) {
		        	db.deleteObjectStore("profile");
		        };

		        if(db.objectStoreNames.contains("investment")) {
		        	db.deleteObjectStore("investment");
		        };

				_object_store = db.createObjectStore("fullName", {keyPath: "key"});
				_object_store = db.createObjectStore("experience", {keyPath: "timeStamp"});
				_object_store = db.createObjectStore("profile", {keyPath: "key"});
				_object_store = db.createObjectStore("investment", {keyPath: "key"});
			};

			request.onsuccess = function(e) {
				_object_store = e.target.result;
				console.log('success open');
				callback(); // read DB
			};

			request.onerror = function(e) {
				console.log('error on DB opening:' + e);
			};
		};

		dal.write = function(data, objectStoreName) {
			console.log(data, objectStoreName);
			var request = _object_store.transaction([objectStoreName], "readwrite").objectStore(objectStoreName).put(data);

			request.onsuccess = function(e) {
				console.log("added successfully");
			};

			request.onerror = function(e) {
				console.log("error on adding:" + e);
			}
		};


		dal.readName = function(callback) {
			var request = _object_store.transaction("fullName").objectStore("fullName").get("name");

			request.onsuccess = function(e) {
				var result = e.target.result;
				console.log("successfully read name");
				callback(result);
			};

			request.onerror = function(e) {
				console.log("Error on reading name:" + e);
			};
		};

		dal.readExperience = function(callback) {
			var request = _object_store.transaction(["experience"], "readwrite").objectStore("experience");
			contentExpItem = [];
			var keyRange = IDBKeyRange.lowerBound(0);
			var cursorRequestItem = request.openCursor(keyRange);

			cursorRequestItem.onsuccess = function(e) {
				var result = e.target.result;
				if(!!result == false) {
					console.log("successfully read experience");
					callback(contentExpItem);
					return;
				};
				contentExpItem.push(result.value);
				result.continue();
			};

			cursorRequestItem.onerror = function(e) {
				console.log("error on reading");
			};			
		};

		dal.readProfile = function(callback) {
			var request = _object_store.transaction(["profile"], "readwrite").objectStore("profile").get("profile");

			request.onsuccess = function(e) {
				var result = e.target.result;
				console.log("successfully read profile");
				callback(result);
			};

			request.onerror = function(e) {
				console.log("Error on reading profile:" + e);
			};

		};

		dal.readInvestment = function(callback) {
			var request = _object_store.transaction(["investment"], "readwrite").objectStore("investment").get("profile_2");

			request.onsuccess = function(e) {
				var result = e.target.result;
				console.log("successfully read investment");
				callback(result);
			};

			request.onerror = function(e) {
				console.log("Error on reading investment:" + e);
			};

		};

		dal.deleteExp = function(expItem) {
			var request = _object_store.transaction(["experience"], "readwrite").objectStore("experience").delete(expItem);

			request.onsuccess = function(e) {
				console.log("success on exp. item deleting");
			};

			request.success = function(e) {
				console.log("error on exp. item deleting")
			};
		};

		return dal;
	}
})();