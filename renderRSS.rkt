#! /usr/bin/env racket
#lang racket/base

(require srfi/19)
(require racket/string)
(require racket/vector)
(require "shared.rkt")

(define (iso->rfc iso)
  (date->string (string->date iso "~Y-~m-~d") "~a, ~d ~b ~Y"))

(define (wrap-in-feed items)
  (format "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>
<rss version=\"2.0\">
<channel>
  <title>~a</title>
  <link>~a</link>
  <description>~a</description>
  ~a
</channel>
</rss>" site-title site-url site-description (string-join items "\n")))

(define (render-feed-item title guid href pub-date)
  (format "<item>
    <title>~a</title>
    <guid>~a</guid>
    <link>~a</link>
    <pubDate>~a</pubDate>
  </item>" title href href pub-date))

(define (render-feed-body . file-names)
  (map (lambda (a)
         (let [(href (format "~a/~a" site-url (cadddr a)))]
           (render-feed-item (caddr a) href href (iso->rfc (car a)))))
       (apply get-sorted-articles file-names)))

(define (render-rss-feed . file-names)
  (spit "web/rss.xml" (wrap-in-feed (apply render-feed-body file-names))))


(void (when (> (vector-length (current-command-line-arguments)) 0)
        (apply render-rss-feed (vector->list (current-command-line-arguments)))))
