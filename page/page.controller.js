
(function(){
	'use strict';

	angular
		.module('pageApp')
		.controller('PageController', PageController);

	PageController.$inject = ['$scope','DAL'];

	function PageController($scope, DAL) {

		var vm = this;

		// store values for drop down menus
		vm.dropDownTypes = ["Lawyer", "Advisor", "VC", "Angel Investor"];
		vm.optionsCountry = [
			{ label: "Ukraine"},
    		{ label:  "UK"},
    		{ label:  "USA"},
    		{ label:  "Switzerland"}
		];
		// store selected value from cantry drop down menu
		vm.selectedItem = "";

		vm.isEdit = false;           // store edit/view GLOBAL STATE
		// States of experience part
		vm.isEditName = false;       // store edit/view state for name fields
		vm.isEditInfo = false;       // store edit/view state for additional info field 
		vm.isEditExp = [];           // store edit state for each exist experience items
		vm.isAddExp = false;         // show empty New experience form

		// States of profile part
		vm.isEditProfileFields = {
			"location": false,
			"investment": false,
			"type": false,
			"capital": false,
			"preferences": false,
			"preferencesItem": false,
			"experience": false,
			"experienceItem": false,
			"skills": false,
			"skillsItem": false
		};

		// object for storing full name and additional data
		vm.fullName = {};

		// object for storing Experience item data
		vm.newExperience = {          
			"company": "",
			"roletype": "",
			"title": "",
			"description": "",
			"timeStamp": new Date().getTime()
		};

		// object for storing Investor Profile data
		vm.investorProfileData = {};

		// object for storing Investment Preferences
		vm.investorProfileData_2 = {};

		// store all experience items loaded fromDB
		vm.expItemContent = [];

		DAL.open(readDB);

		vm.reset = function() {
			console.log();
		};
/********************* STATES ROUTINES **************************/

		// set Global state to View mode
		vm.globalStateIsView = function() {
			vm.isEdit = false;
			// set all others states to view mode
			vm.changeStateName();
			vm.changeStateInfoField();
			vm.editExperience();
			vm.isAddExp = false;
			vm.editProfile(); 
			// reload data if changes was not accepted
			readDB(); 
		};

		// set global state to Edit mode
		vm.globalStateIsEdit = function() {
			vm.isEdit = true;
		};

		// change state view/edit for name fields
		vm.changeStateName = function() {
			if(vm.isEdit === true)
				vm.isEditName = true;
			else
				vm.isEditName = false;
		};

		// change state view/edit for addtional info field
		vm.changeStateInfoField = function() {
			if(vm.isEdit === true)
				vm.isEditInfo = true;
			else
				vm.isEditInfo = false;
		};

		// change state view/edit for Experience item (pen button)
		vm.editExperience = function(index) {
			if(vm.isEdit === true) {
				vm.isEditExp[index] = true;  // show experience form for editing
			}else {
				for (var i = 0; i < vm.isEditExp.length; i++) {
					vm.isEditExp[i] = false;
				}
			}
		};

		// add new Experience item
		vm.addNewExpItem = function() {
			// Add empty experience form 
			vm.isAddExp = true;
		};

		// change states of PROFILE fields 
		vm.editProfile = function(fieldId) {
			vm.isEditProfileFields[fieldId] = !vm.isEditProfileFields[fieldId];
			// reset all others states (because only one field can be editable at once)
			for (var state in vm.isEditProfileFields) {
				if(state != fieldId)
					vm.isEditProfileFields[state] = false;
			};
		};

/************************ DB ROUTINES ***************************/

		// read profile information from DB
		function readDB() {
			DAL.readName(fetchName);
			DAL.readExperience(fetchExperience);
			DAL.readProfile(fetchProfile);
			DAL.readInvestment(fetchProfile_2);
		};

		function fetchName(name) {
			if(name != undefined) {
				$scope.$apply(function() {
					// fetch name for view mode
					vm.fullName = name;
				});
			} else {
				// set def. value
				vm.fullName = {           
					"firstName": "",
					"lastName": "",
					"additInfo": "",
					"key": "name"            
				};
			};

		};

		function fetchExperience(experianceData) {
			$scope.$apply(function() {
				vm.expItemContent = experianceData;
				// set edit state to false by def.
				for (var i = 0; i < vm.expItemContent.length; i++) {
					vm.isEditExp[i] = false;
				};
			});
		};

		function fetchProfile(profileData) {
			if(profileData != undefined) {
				$scope.$apply(function() {
					vm.investorProfileData = profileData;
				});
			} else {
				// set def. value
				vm.investorProfileData = {
					"location": "",
					"investment": "",
					"type": "",
					"capital": "",
					"key": "profile"
				};
			};
		};

		function fetchProfile_2(profileData_2) {
			if(profileData_2 != undefined){
				$scope.$apply(function() {
					vm.investorProfileData_2 = profileData_2;
				});
			} else {
				// set def. value
				vm.investorProfileData_2 = {
					"investment": {
						"message": "",
						"item": []
					},
					"experience": {
						"message": "",
						"item": []
					},
					"skills": {
						"message": "",
						"item": []
					},
					"key": "profile_2"
				};
			};
		};

		/********** NAME & ADITIONAL INFO ROUTINES *******/

		// save/change the name and additional info
		vm.acceptName = function() {
			console.log(vm.fullName);
			DAL.write(vm.fullName, "fullName");
			readDB();
		};

		// discard changes and reload name and additional info
		vm.rejectName = function() {
			DAL.readName(fetchName);
		};

		/************* EXPERIENCE ROUTINES ***********/

		// accept new experiance item
		vm.acceptExpItem = function() {
			DAL.write(vm.newExperience, "experience");
			vm.isAddExp = false;    // hide adding form after accepting new data
			vm.newExperience = {    // erase form fields        
				"company": "",
				"roletype": "",
				"title": "",
				"description": "",
				"timeStamp": new Date().getTime()
			};
			readDB();
		};

		// reject new experiance item (Cancel button on form)
		vm.rejectExpItem = function() {
			vm.isAddExp = false;    // hide adding form after accepting new data
			vm.newExperience = {    // erase form fields        
				"company": "",
				"roletype": "",
				"title": "",
				"description": "",
				"timeStamp": new Date().getTime()
			};
		};

		// accept changes to exist experience item - EDIT button, at edit mode
		// delete and add adited item
		vm.updateExpItem = function(index) {
			DAL.deleteExp(vm.expItemContent[index].timeStamp);
			DAL.write(vm.expItemContent[index], "experience");
			vm.isAddExp = false; // hide adding form after accepting new data
			readDB();
		};

		// reject changes in experience form - CANCEL button, at edit mode
		// set isEditExp for current item to false (close the edit form to view) 
		vm.rejectExpChanges = function(index) {
			vm.isEditExp[index] = false;
		};

		// delete experience item
		vm.deleteExpItem = function(index) {
			DAL.deleteExp(vm.expItemContent[index].timeStamp);
			readDB();
		};

		/************ INVESTOR PROFILE ROUTINES ********/

		vm.acceptProfile = function() {
			DAL.write(vm.investorProfileData, "profile");
		};

		vm.rejectProfile = function() {
			DAL.readProfile(fetchProfile);
		};

		/******** PROFILE ALL OTHERS ROUTINES *******/

		// accept changes to message field
		vm.acceptInvestment = function() {
			DAL.write(vm.investorProfileData_2, "investment");
		};

		// reject changes to message field
		vm.rejectInvestment = function() {
			DAL.readInvestment(fetchProfile_2);
		};

		vm.acceptItem = function(field) {
			if(vm.selectedItem.label != undefined) {
				vm.investorProfileData_2[field].item.push(vm.selectedItem.label);
				DAL.write(vm.investorProfileData_2, "investment");
			}
			vm.selectedItem = "";
		};

		vm.deleteItem = function(item, field) {
			vm.investorProfileData_2[field].item.splice(item, 1);
			DAL.write(vm.investorProfileData_2, "investment");
		};

	};

})();