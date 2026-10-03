all:
	guile ./src/build.scm

clean:
	rm -rf ./dist/

deploy:
	rsync -avhe ssh --delete ./dist/ cocz.net@cocz.net:./www/

.PHONY: all deploy clean
