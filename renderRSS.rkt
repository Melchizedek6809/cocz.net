#! /usr/bin/env racket
#lang racket/base
(require srfi/19)
(require racket/format)
(require racket/list)
(require racket/port)
(require racket/string)
(require racket/vector)

(define site-url "https://cocz.net")

(define (slurp file-name)
  (port->string (open-input-file file-name) #:close? #t))

(define (spit file-name content)
  (call-with-output-file file-name
    #:exists 'truncate
    (lambda (out)
      (display content out))))

(define (extract-title markup)
  (let [(start (+ 7 (string-find markup "<title>")))
        (end        (string-find markup "</title>"))]
    (string-trim (substring markup start end))))

;; <meta name="date" content="2025-04-13T00:00:00.000Z">
(define (extract-pub-date markup)
  (let [(m (regexp-match #rx"<meta name=\"date\" content=\"(20[0-9][0-9]-[01][0-9]-[0123][0-9])T[^Z]+Z\">" markup))]
    (and m (cadr m))))

(define (gen-href file-name)
  (car (last-pair (string-split file-name "/"))))

(define (get-articles . file-names)
  (filter-map (lambda (file-name)
         (let* [(markup (slurp file-name))
                (title (extract-title markup))
                (pub-date (extract-pub-date markup))
                (href (gen-href file-name))]
           (and pub-date (list pub-date file-name title href)))) file-names))

(define (get-sorted-articles . file-names)
  (sort (apply get-articles file-names) 
        (lambda (a b) (string>? (car a) (car b)))))

(define (iso->rfc iso)
  (date->string (string->date iso "~Y-~m-~d") "~a, ~d ~b ~Y"))

(define (render-feed-body . file-names)
  (let [(articles (apply get-sorted-articles file-names))]
    (string-join (map (lambda (a) (let [(href (format "~a/~a" site-url (cadddr a)))
                                        (pub-date (iso->rfc (car a)))]
                                    (format "<item>
    <title>~a</title>
    <guid>~a</guid>
    <link>~a</link>
    <pubDate>~a</pubDate>
  </item>" (caddr a) href href pub-date))) articles) "\n")))

(define (render-rss-feed . file-names)
  (spit "web/rss.xml" (format "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>
<rss version=\"2.0\">
<channel>
  <title>Ben's Blog</title>
  <link>https://cocz.net</link>
  <description>Ramblings from cyberspace</description>
  ~a
</channel>
</rss>" (apply render-feed-body file-names))))


(when (> (vector-length (current-command-line-arguments)) 0)
  (apply render-rss-feed (vector->list (current-command-line-arguments))))
