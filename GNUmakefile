IN  := $(shell find web -type f -name '*.htm')
OUT := $(IN:.htm=.html)

all: $(OUT) web/index.html web/rss.xml
	@echo "Rendered all files"

web/rss.xml: renderRSS.rkt $(OUT)
	./renderRSS.rkt $(OUT)

web/index.html: template.html renderIndex.rkt $(OUT)
	./renderIndex.rkt $(OUT)

%.html: %.htm template.html renderHtm.rkt
	./renderHtm.rkt $<

clean:
	rm -rf $(OUT)

deploy: all
	rsync -avhe ssh --exclude '*.htm' --delete  ./web/ cocz.net@cocz.net:./www/

.PHONY: all deploy clean
