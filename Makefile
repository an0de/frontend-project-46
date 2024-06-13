CC_TEST_REP_URL = https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64
CC_TEST_REP = ./cc-test-reporter

test:
	npx jest

test-cov:
	curl -L $(CC_TEST_REP_URL) $(CC_TEST_REP) 
	chmod +x .$(CC_TEST_REP)
	$(CC_TEST_REP) before-build
	npx jest --coverage
	$(CC_TEST_REP) after-build

lint:
	npx eslint src __tests__ formatters bin

fix:
	npx eslint --fix src __tests__ formatters bin

.PHONY: test test-cov lint fix
