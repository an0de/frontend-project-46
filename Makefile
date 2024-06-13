CC_TEST_REP_URL = https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64
CC_TEST_REP = ./cc-test-reporter

install:
	npm i

test:
	npx jest

test-cov:
	curl -L -o $(CC_TEST_REP) $(CC_TEST_REP_URL)
	chmod +x $(CC_TEST_REP)
	$(CC_TEST_REP) before-build
	npx jest --coverage
	$(CC_TEST_REP) after-build

lint:
	npx eslint src __tests__ formatters bin

fix:
	npx eslint --fix src __tests__ formatters bin

.PHONY: install test test-cov lint fix
