default:
	$(error please pick a target)


build:
	hugo

run:
	hugo server -D
