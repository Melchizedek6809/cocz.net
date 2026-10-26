#! /usr/bin/env racket
#lang racket/base

(require racket/string)
(require racket/vector)
(require "shared.rkt")

(define (render-index-body . file-names)
  (let [(articles (apply get-sorted-articles file-names))]
    (string-join (map (lambda (a) (format "<a href=\"~a\">~a - ~a</a>\n" (cadddr a) (car a) (caddr a))) articles) "<br/>")))

(define (render-index-page . file-names)
  (spit "web/index.html" (wrap-in-template "<title>Ben's Blog</title>" (format "<main><nav>~a</nav></main>" (apply render-index-body file-names)))))

(void (when (> (vector-length (current-command-line-arguments)) 0)
        (apply render-index-page (vector->list (current-command-line-arguments)))))
