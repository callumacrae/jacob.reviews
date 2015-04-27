'use strict';

const browserSync = require('browser-sync');
const chalk = require('chalk');
const gulp = require('gulp');
const nodemon = require('nodemon');

gulp.task('run', function (done) {
	function doneOnce() {
		done();
		doneOnce = function () {};
	}

	nodemon('--watch api ./api --port 3025')
		.on('start', function () {
			console.log(chalk.grey('App has started'));
			doneOnce();
		})
		.on('restart', function () {
			console.log(chalk.grey('App restarting'));
		})
		.on('crash', function () {
			console.log(chalk.grey('App has crashed'));
		});
});

gulp.task('default', ['run'], function () {
	let files = [
		'./app/*'
	];

	browserSync.init(files, {
		proxy: 'http://localhost:3025/'
	});

	gulp.watch('./app/assets/css/*.css', ['css']);
	gulp.watch('./app/assets/js/*.js', ['js']);
});
