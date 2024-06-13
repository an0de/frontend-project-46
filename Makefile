install:
	npm i

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

test-cov:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

lint:
	npx eslint src __tests__ formatters bin

fix:
	npx eslint --fix src __tests__ formatters bin

.PHONY: test test-index lint fmt
