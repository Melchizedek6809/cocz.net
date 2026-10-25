#! /usr/bin/env racket
#lang racket/base
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

(define template (slurp "template.html"))

(define (wrap-in-template head-markup body-markup)
  (string-replace (string-replace template "<!-- HEAD_INSERTION_POINT -->" head-markup)
                  "<!-- BODY_INSERTION_POINT -->" body-markup))

(define (parse-content-html markup)
  (let [(head-start (+ 6 (string-find markup "<head>")))
        (head-end        (string-find markup "</head>"))
        (body-start (+ 6 (string-find markup "<body>")))
        (body-end        (string-find markup "</body>"))]
    (list (string-trim (substring markup head-start head-end))
          (string-trim (substring markup body-start body-end)))))

(define (render-file content-file-name)
  (spit (string-append content-file-name "l")
        (apply wrap-in-template (parse-content-html (slurp content-file-name)))))

(void (when (vector? (current-command-line-arguments))
        (vector-map render-file (current-command-line-arguments))))
