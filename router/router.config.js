
(function() {
	'use strict';

	angular
		.module('pageApp')
		.config(UiRouter);

	UiRouter.$inject = ['$stateProvider'];

	function UiRouter($stateProvider) {

		//$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home',{
				url: '',
				contorller: 'PageController',
				views: {
					'profile': {
						templateUrl: 'userProfile/userProfile.html'
					},
					'experience': {
						templateUrl: 'userExperience/expItem.html'
					}
				}
			})
	}

})();