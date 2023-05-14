build:
	yarn make
	yarn make --platform=darwin --arch=universal

publish:
	@make build
	yarn run publish
