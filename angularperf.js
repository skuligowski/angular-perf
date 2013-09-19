(function(window, document) {
'use strict';
	
	var tests = [],
		lab = $LAB.setOptions({AlwaysPreserveOrder:true});

	var createTestObj = function(name) {
		return {
			id: 'testCase'+tests.length,
			name: String(name).
				replace(/&/g, '&amp;').
				replace(/</g, '&lt;').
				replace(/>/g, '&gt;').
				replace(/"/g, '&quot;')
		}
	},

	normalizeName = function(name) {
		return name;
	},

	test = function(name, options) {
		
		var testObj = createTestObj(name),
			id = testObj.id;

		if (options.load) {
			for(var i = 0; i < options.load.length; i++)
				lab = lab.script(options.load[i]);
		}

		lab.wait(function() {
			var element = angular.element('<div id="'+testObj.id+'">'+((options.template) ? options.template : '') +'</div>');
			document.body.appendChild(element[0]);

			var app = angular.module(id, []);
			if (options.setup)
				options.setup(app);
			app.factory(id+'TestService', options.test);
			var injector = angular.bootstrap(element, [id]);
			testObj.fn = injector.get(id+'TestService');
			tests.push(testObj);
		});

		return angularperf;
	},

	run = function() {
		lab.wait(function() {
			var suite = new Benchmark.Suite;

			for(var i = 0; i < tests.length; i++) {
				var testItem = tests[i];
				suite.add(testItem.name, testItem.fn);
			}
				
			suite.on('cycle', function(event) {
				var element = angular.element('<div>'+String(event.target)+'</div>');
				document.body.appendChild(element[0]);
			})
			.on('complete', function() {
				var element = angular.element('<div>Fastest is ' + this.filter('fastest').pluck('name') + '</div>');
				document.body.appendChild(element[0]);
			})
			.run({ 'async': true });

		});
	};

	angularperf = window.angularperf || (window.angularperf = {});

	angularperf.test = test;
	angularperf.run = run;

})(window, document);
