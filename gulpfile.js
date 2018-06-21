const gulp = require("gulp");
const typescript = require("gulp-typescript");

gulp.task("build", () => {
	const pj = typescript.createProject("./tsconfig.json");

	gulp.src([
		"./src/**/*.ts",
		"!./node_modules/**"
	])
	.pipe(pj())
	.js
	.pipe(gulp.dest("./app"));
});
