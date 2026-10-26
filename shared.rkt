#lang racket/base

(require racket/port)
(require racket/list)
(require racket/string)
(require racket/vector)

(provide (all-defined-out))

(define site-title "Ben's Blog")
(define site-url "https://cocz.net")
(define site-description "Ramblings from cyberspace")

(define (slurp file-name)
  (port->string (open-input-file file-name) #:close? #t))

(define (spit file-name content)
  (call-with-output-file file-name
    #:exists 'truncate
    (lambda (out)
      (display content out))))

(define template (slurp "template.html"))

(define (wrap-in-template head-markup body-markup)
  (string-replace (string-replace template
                                  "<!-- HEAD_INSERTION_POINT -->" head-markup)
                  "<!-- BODY_INSERTION_POINT -->" body-markup))

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
