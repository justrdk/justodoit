'use strict'

module.exports = (grunt) ->

	grunt.initConfig
		pkg: '<json:package.json>'
		requirejs:
			compile:
				options:
					baseUrl: 'public/assets/js/'
					mainConfigFile : 'public/assets/js/main.js'
					out: 'public/assets/js/main-optimized.js'
					name : 'main'
		coffee:
			dist:
				files: [{
						expand: true
						flatten: true
						cwd: 'coffeefiles/components/'
						src: ['**/*.coffee']
						dest: 'public/assets/js/components/'
						ext: '.js'
					}, {
						expand: true
						flatten: true
						cwd: 'coffeefiles/controllers/'
						src: ['**/*.coffee']
						dest: 'public/assets/js/controllers/'
						ext: '.js'
					}, {
						expand: true
						flatten: true
						cwd: 'coffeefiles/models/'
						src: ['**/*.coffee']
						dest: 'public/assets/js/models/'
						ext: '.js'
					}
				]
		watch:
			scripts:
				files:['public/assets/js/main.js', 'coffeefiles/components/*.coffee', 'coffeefiles/controllers/*.coffee', 'coffeefiles/models/*.coffee']
				tasks: ['coffee']
				options:
					spawn: false

	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-requirejs')
	grunt.loadNpmTasks('grunt-contrib-coffee')

	grunt.registerTask('deploywatch', ['coffee','watch'])
	grunt.registerTask('deploy', ['coffee'])
	grunt.registerTask('deployprod', ['coffee', 'requirejs'])
