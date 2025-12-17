TESTS = test/*.js

all: test

build: clean compile

compile:
	npm install .
	npm run install

test: build
	@./node_modules/nodeunit/bin/nodeunit \
		$(TESTS)

clean:
	rm -Rf lib/bindings/


.PHONY: clean test build

BIN := $(THIS_DIR)/node_modules/.bin

# Path
PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

# applications
NODE ?= $(shell which node)
YARN ?= $(shell which yarn)
PKG ?= $(if $(YARN),$(YARN),$(NODE) $(shell which npm))
BROWSERIFY ?= $(NODE) $(BIN)/browserify

.FORCE:

install: node_modules

node_modules: package.json
	@NODE_ENV= $(PKG) install
	@touch node_modules

lint: .FORCE
	eslint browser.js debug.js index.js node.js

test-node: .FORCE
	istanbul cover node_modules/mocha/bin/_mocha -- test/**.js

test-browser: .FORCE
	mkdir -p dist

	@$(BROWSERIFY) \
		--standalone debug \
		. > dist/debug.js

	karma start --single-run
	rimraf dist

test: .FORCE
	concurrently \
		"make test-node" \
		"make test-browser"

coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: all install clean distclean
