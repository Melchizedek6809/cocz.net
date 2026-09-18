all:
	guile ./src/build.scm

clean:
	rm -rf ./dist/

deploy:
	rsync -avhe ssh --delete ./dist/ cocz.net:./www/cocz.net/

.PHONY: all deploy clean
