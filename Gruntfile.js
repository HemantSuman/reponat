module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'public/front/assets/css/style.css' : 'public/front/assets/sass/style.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	
	grunt.registerTask('default',['watch']);
	
}