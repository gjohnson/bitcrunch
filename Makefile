REPORTER = spec
TESTS = $(wildcard test/test.*.js)

test:
	@NODE_ENV=test ./node_modules/.bin/mocha $(TESTS) \
		--require "should" \
		--growl \
		--reporter $(REPORTER)

test-cov: lib-cov
	@BITCRUNCH_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

clean:
	@rm -rf lib-cov coverage.html

.PHONY: test lib-cov