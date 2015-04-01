(function() {
	'use strict';

	angular
		.module('pageApp')
		.directive('dirUserExpNew', dirUserExpNew);

	function dirUserExpNew() {

		return {
			restrict: 'E',
			//transclude: true,
			templateUrl: function(elem, attr) {
				return 'userExperience/dir-user-exp-' + attr.type + '.html';
			}
		};
	};

})();