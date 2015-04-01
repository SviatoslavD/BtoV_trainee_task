(function() {
	'use strict';

	angular
		.module('pageApp')
		.directive('dirUserProfile', dirUserProfile);

	function dirUserProfile() {

		return {
			restrict: 'E',
			templateUrl: function(elem, attr) {
				return 'userProfile-Skills/dir-user-profile.html';
			}
		};
	};

})();