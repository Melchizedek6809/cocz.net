all:
	guile ./src/build.scm

clean:
	rm -rf ./dist/

deploy:
	rsync -avhe ssh --delete ./dist/ cocz.net:./cocz.net/

.PHONY: all deploy clean
