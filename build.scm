#!/usr/bin/env -S guile --no-auto-compile -s
!#

(use-modules (commonmark)
             (ice-9 ftw)
             (ice-9 popen)
             (ice-9 rdelim)
             (ice-9 regex)
             (ice-9 threads)
             (ice-9 textual-ports)
             (srfi srfi-1)
             (srfi srfi-13)
             (srfi srfi-19)
             (srfi srfi-9)
             (sxml simple))

(define site-url "https://cocz.net")
(define css-source-path "src/fe/css/index.css")
(define branding-source-path "src/fe/css/branding")
(define assets-output-path "dist/assets")
(define slug-regexp (make-regexp "^[0-9-]*(.*)$"))

(define (read-file path)
  (call-with-input-file path get-string-all))

(define (write-file path content)
  (mkdir-p (dirname path))
  (call-with-output-file path
    (lambda (port)
      (display content port))))

(define (path-exists? path)
  (false-if-exception (stat path)))

(define (directory? path)
  (eq? 'directory (stat:type (stat path))))

(define (mkdir-p path)
  (unless (or (string=? path ".") (string=? path "/") (path-exists? path))
    (mkdir-p (dirname path))
    (mkdir path)))

(define (remove-tree path)
  (when (path-exists? path)
    (if (directory? path)
        (begin
          (for-each
           (lambda (name)
             (unless (member name '("." ".."))
               (remove-tree (string-append path "/" name))))
           (scandir path))
          (rmdir path))
        (delete-file path))))

(define (copy-directory source destination)
  (mkdir-p destination)
  (unless (zero? (system* "cp" "-R" (string-append source "/.") destination))
    (error "failed to copy directory" source destination)))

(define (string-replace-all input needle replacement)
  (if (string-null? needle)
      input
      (let loop ((rest input) (parts '()))
        (let ((index (string-contains rest needle)))
          (if index
              (loop (substring rest (+ index (string-length needle)))
                    (cons replacement
                          (cons (substring rest 0 index) parts)))
              (string-concatenate-reverse (cons rest parts)))))))

(define (escape-with value replacements)
  (fold (lambda (pair result)
          (string-replace-all result (car pair) (cdr pair)))
        value
        replacements))

(define common-escape-replacements
  '(("&" . "&amp;")
    ("<" . "&lt;")
    (">" . "&gt;")
    ("\"" . "&quot;")))

(define html-escape-replacements
  (append common-escape-replacements '(("'" . "&#039;"))))

(define xml-escape-replacements
  (append common-escape-replacements '(("'" . "&apos;"))))

(define (html-escape value)
  (escape-with value html-escape-replacements))

(define (xml-escape value)
  (escape-with value xml-escape-replacements))

(define (json-escape value)
  (string-append
   "\""
   (string-concatenate
    (map (lambda (char)
           (case char
             ((#\") "\\\"")
             ((#\\) "\\\\")
             ((#\newline) "\\n")
             ((#\return) "\\r")
             ((#\tab) "\\t")
             (else (string char))))
         (string->list value)))
   "\""))

(define (date-iso date)
  (and date (string-append date "T00:00:00.000Z")))

(define (date-rfc822 date)
  (if date
      (let ((year (string->number (substring date 0 4)))
            (month (string->number (substring date 5 7)))
            (day (string->number (substring date 8 10))))
        (date->string (make-date 0 0 0 0 day month year 0)
                      "~a, ~d ~b ~Y ~H:~M:~S GMT"))
      (date->string (current-date 0) "~a, ~d ~b ~Y ~H:~M:~S GMT")))

(define (absolute-url url)
  (if (or (string-prefix? "http://" url)
          (string-prefix? "https://" url))
      url
      (string-append site-url (if (string-prefix? "/" url) url (string-append "/" url)))))

(define (strip-quotes value)
  (let ((trimmed (string-trim-both value)))
    (if (and (>= (string-length trimmed) 2)
             (or (and (char=? (string-ref trimmed 0) #\")
                      (char=? (string-ref trimmed (- (string-length trimmed) 1)) #\"))
                 (and (char=? (string-ref trimmed 0) #\')
                      (char=? (string-ref trimmed (- (string-length trimmed) 1)) #\'))))
        (substring trimmed 1 (- (string-length trimmed) 1))
        trimmed)))

(define (split-inline-list value)
  (let* ((trimmed (string-trim-both value))
         (inner (if (and (string-prefix? "[" trimmed) (string-suffix? "]" trimmed))
                    (substring trimmed 1 (- (string-length trimmed) 1))
                    trimmed)))
    (if (string-null? (string-trim-both inner))
        '()
        (map strip-quotes (string-split inner #\,)))))

(define (parse-frontmatter-value key value)
  (cond
   ((string=? key "tags") (split-inline-list value))
   ((string=? value "true") #t)
   ((string=? value "false") #f)
   (else (strip-quotes value))))

(define (parse-frontmatter raw)
  (let ((lines (string-split raw #\newline)))
    (if (and (pair? lines) (string=? (string-trim-both (car lines)) "---"))
        (let loop ((rest (cdr lines)) (front '()))
          (cond
           ((null? rest)
            (values (reverse front) ""))
           ((string=? (string-trim-both (car rest)) "---")
            (values (reverse front) (string-join (cdr rest) "\n")))
           (else
            (loop (cdr rest) (cons (car rest) front)))))
        (values '() raw))))

(define (parse-frontmatter-fields lines)
  (let loop ((remaining lines) (fields '()))
    (if (null? remaining)
        fields
        (let* ((line (car remaining))
               (colon (string-index line #\:)))
          (if (not colon)
              (loop (cdr remaining) fields)
              (let ((key (substring line 0 colon))
                    (value (string-trim-both (substring line (+ colon 1)))))
                (if (and (string=? key "tags") (string-null? value))
                    (let tag-loop ((rest (cdr remaining)) (tags '()))
                      (if (and (pair? rest)
                               (string-prefix? "-" (string-trim-both (car rest))))
                          (tag-loop (cdr rest)
                                    (cons (strip-quotes
                                           (substring (string-trim-both (car rest)) 1))
                                          tags))
                          (loop rest (acons "tags" (reverse tags) fields))))
                    (loop (cdr remaining)
                          (acons key (parse-frontmatter-value key value) fields)))))))))

(define (field fields key default)
  (let ((value (assoc-ref fields key)))
    (if value value default)))

(define (slug-from-filename filename)
  (let* ((without-ext (if (string-suffix? ".md" filename)
                          (substring filename 0 (- (string-length filename) 3))
                          filename))
         (without-prefix (if (and (> (string-length without-ext) 0)
                                  (or (char=? (string-ref without-ext 0) #\_)
                                      (char=? (string-ref without-ext 0) #\/)))
                             (substring without-ext 1)
                             without-ext)))
    (match:substring (regexp-exec slug-regexp without-prefix) 1)))

(define (protect-simple-tag line tag raw-values)
  (let ((open (string-append "<" tag))
        (close (string-append "</" tag ">")))
    (let loop ((rest line) (out "") (stored raw-values))
      (let ((start (string-contains rest open)))
        (if (not start)
            (values (string-append out rest) stored)
            (let* ((after-start (substring rest start))
                   (end-rel (string-contains after-start close)))
              (if (not end-rel)
                  (values (string-append out rest) stored)
                  (let* ((end (+ end-rel (string-length close)))
                         (raw (substring after-start 0 end))
                         (token (string-append "@@COCZ_RAW_" (number->string (length stored)) "@@")))
                    (loop (substring after-start end)
                          (string-append out (substring rest 0 start) token)
                          (append stored (list raw)))))))))))

(define (protect-inline-html line raw-values)
  (call-with-values
      (lambda () (protect-simple-tag line "a" raw-values))
    (lambda (line values)
      (protect-simple-tag line "kbd" values))))

(define (fence-line? line)
  (let ((trimmed (string-trim-both line)))
    (or (string-prefix? "```" trimmed)
        (string-prefix? "~~~" trimmed))))

(define (protect-raw-html markdown)
  (let loop ((lines (string-split markdown #\newline))
             (out '())
             (raw-values '())
             (in-code? #f))
    (cond
     ((null? lines)
      (values (string-join (reverse out) "\n") raw-values))
     ((fence-line? (car lines))
      (loop (cdr lines) (cons (car lines) out) raw-values (not in-code?)))
     (in-code?
      (loop (cdr lines) (cons (car lines) out) raw-values in-code?))
     ((string-prefix? "<div" (string-trim-both (car lines)))
      (let block-loop ((rest (cdr lines)) (block (list (car lines))))
        (if (or (string-contains (car block) "</div>")
                (null? rest))
            (let ((token (string-append "@@COCZ_RAW_" (number->string (length raw-values)) "@@")))
              (loop rest
                    (cons token out)
                    (append raw-values (list (string-join (reverse block) "\n")))
                    in-code?))
            (block-loop (cdr rest) (cons (car rest) block)))))
     (else
      (call-with-values
          (lambda () (protect-inline-html (car lines) raw-values))
        (lambda (line values)
          (loop (cdr lines) (cons line out) values in-code?)))))))

(define (restore-raw-html html raw-values)
  (let loop ((index 0) (values raw-values) (result html))
    (if (null? values)
        result
        (let* ((token (string-append "@@COCZ_RAW_" (number->string index) "@@"))
               (paragraph-token (string-append "<p>" token "</p>"))
               (raw (car values)))
          (loop (+ index 1)
                (cdr values)
                (string-replace-all
                 (string-replace-all result paragraph-token raw)
                 token raw))))))

(define (render-markdown markdown)
  (call-with-values
      (lambda () (protect-raw-html markdown))
    (lambda (protected raw-values)
      (let* ((html (call-with-output-string
                     (lambda (port)
                       (sxml->xml (commonmark->sxml protected) port))))
             (with-code-class (string-replace-all html
                                                   "<pre><code class=\"language-"
                                                   "<pre><code class=\"hljs language-")))
        (restore-raw-html with-code-class raw-values)))))

(define-record-type <entry>
  (make-entry url title date description tags content image hidden)
  entry?
  (url entry-url)
  (title entry-title)
  (date entry-date)
  (description entry-description)
  (tags entry-tags)
  (content entry-content)
  (image entry-image)
  (hidden entry-hidden?))

(define (load-entry filename)
  (let* ((raw (read-file (string-append "content/" filename))))
    (call-with-values
        (lambda () (parse-frontmatter raw))
      (lambda (frontmatter body)
        (let* ((fields (parse-frontmatter-fields frontmatter))
               (date (field fields "date" #f))
               (image (field fields "image" #f))
               (content (render-markdown body)))
          (make-entry (slug-from-filename filename)
                      (field fields "title" "")
                      date
                      (field fields "description" "")
                      (field fields "tags" '())
                      content
                      (and (string? image) (not (string-null? image)) image)
                      (field fields "hidden" #f)))))))

(define (load-entries)
  (let ((filenames (sort (filter (lambda (name) (string-suffix? ".md" name))
                                 (scandir "content"))
                         string<?)))
    (n-par-map 4 load-entry filenames)))

(define (entry-full-url entry)
  (string-append site-url "/" (entry-url entry) "/"))

(define (entry-image-url entry)
  (and (entry-image entry) (absolute-url (entry-image entry))))

(define (latest-entry-date entries)
  (fold (lambda (entry latest)
          (if (string>? (or (entry-date entry) "") latest)
              (entry-date entry)
              latest))
        ""
        entries))

(define (summary entry)
  (let* ((text (regexp-substitute/global #f "<[^>]*>" (entry-content entry) 'pre "" 'post))
         (decoded (fold (lambda (pair value)
                          (string-replace-all value (car pair) (cdr pair)))
                        text
                        '(("&nbsp;" . " ")
                          ("&amp;" . "&")
                          ("&lt;" . "<")
                          ("&gt;" . ">")
                          ("&quot;" . "\"")
                          ("&apos;" . "'")
                          ("&#039;" . "'")
                          ("&copy;" . "(c)")
                          ("&reg;" . "(r)")
                          ("&trade;" . "(tm)")
                          ("&bull;" . "*")
                          ("&hellip;" . "...")
                          ("&mdash;" . "--")
                          ("&ndash;" . "-")))))
    (string-append (substring decoded 0 (min 200 (string-length decoded))) "...")))

(define (render-tags tags)
  (string-join
   (map (lambda (tag)
          (string-append "<li role=\"listitem\"><span class=\"tag\">"
                         (html-escape tag)
                         "</span></li>"))
        tags)
   " "))

(define (render-teaser entry index)
  (let ((image-attrs (if (>= index 3)
                         " loading=\"lazy\" decoding=\"async\""
                         " decoding=\"async\"")))
    (string-append
     "<article>
            <header class=\"article-header\">
            <h3 class=\"post-title\"><a href=\"/" (entry-url entry) "/\">"
     (html-escape (entry-title entry))
     "</a></h3>
                <div class=\"post-side\">
                    <time datetime=\"" (date-iso (entry-date entry)) "\">" (entry-date entry) "</time>
                    <ul role=\"list\">
                        " (render-tags (entry-tags entry)) "
                    </ul>
                </div>
            </header>
            "
     (if (entry-image entry)
         (string-append "<a class=\"teaser-image-link\" href=\"/" (entry-url entry)
                        "/\"><img class=\"teaser-image\" src=\"" (entry-image entry)
                        "\" alt=\"" (html-escape (entry-title entry)) "\""
                        image-attrs " /></a>")
         (string-append "<p>" (summary entry) "</p>"))
     "
        </article>")))

(define (render-json-ld entry)
  (let ((image (entry-image-url entry)))
    (string-append
     "
            <script type=\"application/ld+json\">
                {\"@context\":\"https://schema.org\",\"@type\":\"BlogPosting\",\"mainEntityOfPage\":{\"@type\":\"WebPage\",\"@id\":"
     (json-escape (entry-full-url entry))
     "},\"headline\":" (json-escape (entry-title entry))
     ",\"description\":" (json-escape (entry-description entry))
     ",\"datePublished\":" (json-escape (date-iso (entry-date entry)))
     ",\"dateModified\":" (json-escape (date-iso (entry-date entry)))
     ",\"author\":{\"@type\":\"Person\",\"url\":\"https://cocz.net/\",\"name\":\"Ben\"}"
     (if image (string-append ",\"image\":" (json-escape image)) "")
     "}
            </script>
            <script type=\"application/ld+json\">
                {\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://cocz.net/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":"
     (json-escape (entry-title entry))
     ",\"item\":" (json-escape (entry-full-url entry))
     "}]}
            </script>
        ")))

(define (render-entry-open-graph entry)
  (let ((image (entry-image-url entry)))
    (string-append
     "
            <meta property=\"og:title\" content=\"" (html-escape (entry-title entry)) "\">
            <meta property=\"og:description\" content=\"" (html-escape (entry-description entry)) "\">
            <meta property=\"og:url\" content=\"" (entry-full-url entry) "\">
            " (if image (string-append "<meta property=\"og:image\" content=\"" image "\">") "") "
            <meta property=\"og:type\" content=\"article\">
            <meta property=\"og:site_name\" content=\"Ben's Blog\">
            <meta property=\"og:locale\" content=\"en_US\">
        ")))

(define (render-entry-metadata entry)
  (string-append
   "
            <meta name=\"description\" content=\"" (html-escape (entry-description entry)) "\">
            <meta name=\"author\" content=\"Ben\">
            <meta name=\"robots\" content=\"max-image-preview:large\">
            <meta name=\"last-modified\" content=\"" (date-iso (entry-date entry)) "\">
            <link rel=\"canonical\" href=\"" (entry-full-url entry) "\">
            " (render-entry-open-graph entry) "
            " (render-json-ld entry) "
        "))

(define (render-full-entry entry)
  (string-append
   "<article class=\"full-article\">
            <header class=\"page-header\">
                <h1 class=\"post-title\">" (entry-title entry) "</h1>
                <div class=\"post-side\">
                    " (if (entry-date entry)
                          (string-append "<time datetime=\"" (date-iso (entry-date entry)) "\">"
                                         (entry-date entry)
                                         "</time>")
                          "") "
                    <ul role=\"list\">
                    " (render-tags (entry-tags entry)) "
                    </ul>
                </div>
            </header>
            " (entry-content entry) "
          </article>"))

(define header-html
  "
        <header class=\"primary-header\">
          <section>
            <h3><a href=\"/\">Ben's blog</a></h3>
            <h4 class=\"cyberspace\">rambling through <span class=\"cs1\">c</span><span class=\"cs2\">y</span><span class=\"cs3\">b</span><span class=\"cs4\">e</span><span class=\"cs5\">r</span><span class=\"cs1\">s</span><span class=\"cs2\">p</span><span class=\"cs3\">a</span><span class=\"cs4\">c</span><span class=\"cs5\">e</span></h4>
          </section>
          <section>
            <nav class=\"primary-nav\">
                <ul role=\"list\">
                    <li role=\"listitem\"><a href=\"/about-me/\" class=\"\">About me</a></li>
                    <li role=\"listitem\"><a href=\"/contact/\" class=\"\">Contact</a></li>
                    <li role=\"listitem\"><a href=\"/rss.xml\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"RSS Feed\" class=\"rss-icon\"></a></li>
                    <li role=\"listitem\"><a href=\"https://sr.ht/~melchizedek6809/\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"sourcehut\" class=\"sourcehut\"></a></li>
                    <li role=\"listitem\"><a href=\"https://github.com/Melchizedek6809\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"GitHub\" class=\"github\"></a></li>
                    <li role=\"listitem\"><a href=\"https://www.twitch.tv/melchizedek6809\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"Twitch\" class=\"twitch\"></a></li>
                </ul>
            </nav>
        </section>
        <div class=\"primary-header-spacer\">
            <div class=\"primary-header-spacer-a\"></div>
            <div class=\"primary-header-spacer-b\"></div>
            <div class=\"primary-header-spacer-c\"></div>
            <div class=\"primary-header-spacer-d\"></div>
            <div class=\"primary-header-spacer-e\"></div>
        </div>
        </header>
    ")

(define footer-html
  "
        <footer class=\"primary-footer\">
          <ul role=\"list\">
            <li role=\"listitem\">
              <a href=\"/impressum/\">Imprint</a>
            </li>

            <li role=\"listitem\">
              Content <a href=\"https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.txt\" target=\"_blank\" rel=\"noopener noreferrer\">CC-BY-NC-ND-4.0</a>
            </li>

            <li role=\"listitem\">
              <a href=\"https://github.com/melchizedek6809/cocz.net/\" target=\"_blank\" rel=\"noopener noreferrer\">Source Code</a>
              <a href=\"https://spdx.org/licenses/MIT.html\" target=\"_blank\" rel=\"noopener noreferrer\">MIT</a>
            </li>
          </ul>
        </footer>
    ")

(define index-open-graph-html
  "
        <meta property=\"og:title\" content=\"Ben's Blog\">
        <meta property=\"og:description\" content=\"ramblings from cyberspace\">
        <meta property=\"og:url\" content=\"https://cocz.net/\">
        <meta property=\"og:image\" content=\"https://url2og.cocz.net/?url=https://cocz.net/\">
        <meta property=\"og:type\" content=\"website\">
        <meta property=\"og:site_name\" content=\"Ben's Blog\">
        <meta property=\"og:locale\" content=\"en_US\">
    ")

(define index-json-ld-html
  "
        <script type=\"application/ld+json\">
            {\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"url\":\"https://cocz.net/\",\"name\":\"Ben's Blog\",\"description\":\"ramblings from cyberspace\"}
        </script>
        <script type=\"application/ld+json\">
            {\"@context\":\"https://schema.org\",\"@type\":\"Person\",\"name\":\"Ben\",\"url\":\"https://cocz.net/\",\"sameAs\":[\"https://sr.ht/~melchizedek6809/\",\"https://github.com/Melchizedek6809\",\"https://www.twitch.tv/melchizedek6809\"]}
        </script>
    ")

(define (render-index entries)
  (let* ((visible (filter (lambda (entry) (not (entry-hidden? entry))) entries))
         (sorted (sort visible (lambda (a b) (string>? (or (entry-date a) "")
                                                       (or (entry-date b) "")))))
         (lastmod (and (pair? sorted) (date-iso (latest-entry-date sorted))))
         (entries-html (string-join
                        (map render-teaser sorted (iota (length sorted)))
                        " ")))
    (values
     (string-append
      "
        <title>Ben's Blog</title>
        <meta name=\"description\" content=\"ramblings from cyberspace\">
        <meta name=\"robots\" content=\"max-image-preview:large\">
        <meta name=\"last-modified\" content=\"" lastmod "\">
        <link rel=\"canonical\" href=\"https://cocz.net/\">
        " index-open-graph-html "
        " index-json-ld-html "
      ")
     (string-append
      "
        " header-html "
        <main class=\"index-main\">
          " entries-html "
        </main>
        " footer-html "
      "))))

(define (render-entry-page entry)
  (values
   (string-append
    "
        <title>" (entry-title entry) "</title>
        <meta name=\"date\" content=\"" (date-iso (entry-date entry)) "\">
        " (render-entry-metadata entry) "
      ")
   (string-append
    "
        " header-html "
        <main>
          " (render-full-entry entry) "
        </main>
        " footer-html "
      ")))

(define (render-contact-page)
  (values
   "
        <title>Contact | Ben's Blog</title>
        <meta name=\"description\" content=\"Contact information for Ben's Blog.\">
        <meta name=\"robots\" content=\"max-image-preview:large\">
        <link rel=\"canonical\" href=\"https://cocz.net/contact/\">
      "
   (string-append
    "
        " header-html "
        <main>
          <article class=\"full-article\">
            <header class=\"page-header\">
              <h1 class=\"post-title\">Contact</h1>
            </header>

            <p>
              Email: <a href=\"mailto:bennyschulenburg@gmx.de\">bennyschulenburg@gmx.de</a>
            </p>

            <p>
              Matrix: <a href=\"https://matrix.to/#/@melchizedek6809:matrix.org\" target=\"_blank\" rel=\"noopener noreferrer\">@melchizedek6809:matrix.org</a>
            </p>
          </article>
        </main>
        " footer-html "
      ")))

(define (render-impressum-page)
  (values
   "
        <title>Imprint | Ben's Blog</title>
        <meta name=\"description\" content=\"Legal notice and contact information for Ben's Blog.\">
        <meta name=\"robots\" content=\"max-image-preview:large\">
        <link rel=\"canonical\" href=\"https://cocz.net/impressum/\">
      "
   (string-append
    "
        " header-html "
        <main>
          <article class=\"full-article\">
            <header class=\"page-header\">
              <h1 class=\"post-title\">Imprint</h1>
            </header>

            <h2>Information pursuant to Section 5 DDG</h2>
            <p>
              Benjamin Schulenburg<br>
              Pfahlstr. 24<br>
              85072 Eichst&auml;tt<br>
              Germany
            </p>

            <h2>Contact</h2>
            <p>
              Email: <a href=\"mailto:bennyschulenburg@gmx.de\">bennyschulenburg@gmx.de</a>
            </p>

            <h2>Responsible for content pursuant to Section 18(2) MStV</h2>
            <p>
              Benjamin Schulenburg<br>
              Pfahlstr. 24<br>
              85072 Eichst&auml;tt<br>
              Germany
            </p>
          </article>
        </main>
        " footer-html "
      ")))

(define (apply-template template head body)
  (string-replace-all
   (string-replace-all template "<!-- HEAD_CONTENT_PLACEHOLDER -->" head)
   "<!-- BODY_CONTENT_PLACEHOLDER -->" body))

(define (convert-relative-urls html)
  (string-replace-all
   (string-replace-all html "href=\"/" (string-append "href=\"" site-url "/"))
   "src=\"/" (string-append "src=\"" site-url "/")))

(define (render-rss entries)
  (let* ((dated (filter entry-date entries))
         (sorted (take (sort dated
                             (lambda (a b) (string>? (entry-date a) (entry-date b))))
                       (min 20 (length dated))))
         (items (string-join
                 (map (lambda (entry)
                        (string-append
                         "    <item>
      <title>" (html-escape (entry-title entry)) "</title>
      <link>" site-url "/" (entry-url entry) "/</link>
      <guid>" site-url "/" (entry-url entry) "/</guid>
      <pubDate>" (date-rfc822 (entry-date entry)) "</pubDate>
      <description>" (html-escape (entry-description entry)) "</description>
      <content:encoded><![CDATA[" (convert-relative-urls (entry-content entry)) "]]></content:encoded>
      " (string-join
          (map (lambda (tag)
                 (string-append "<category>" (html-escape tag) "</category>"))
               (entry-tags entry))
          "\n      ") "
    </item>"))
                      sorted)
                 "\n")))
    (string-append
     "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<rss version=\"2.0\" 
  xmlns:content=\"http://purl.org/rss/1.0/modules/content/\"
  xmlns:atom=\"http://www.w3.org/2005/Atom\">
  <channel>
    <title>Cocz.net</title>
    <link>" site-url "</link>
    <description>A blog about programming, tech, and projects</description>
    <language>en-us</language>
    <lastBuildDate>" (date->string (current-date 0) "~a, ~d ~b ~Y ~H:~M:~S GMT") "</lastBuildDate>
    <atom:link href=\"" site-url "/rss.xml\" rel=\"self\" type=\"application/rss+xml\" />
" items "
  </channel>
</rss>")))

(define (render-sitemap entries)
  (let* ((indexable (filter (lambda (entry)
                              (or (not (entry-hidden? entry))
                                  (string=? (entry-url entry) "about-me")))
                            entries))
         (lastmod (or (and (pair? indexable)
                           (date-iso (latest-entry-date indexable)))
                      (date->string (current-date 0) "~Y-~m-~dT~H:~M:~S.000Z"))))
    (string-append
     "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">
    <!-- Homepage -->
    <url>
        <loc>https://cocz.net/</loc>
        <lastmod>" lastmod "</lastmod>
    </url>

    <!-- Static pages -->
    <url>
        <loc>https://cocz.net/contact/</loc>
        <lastmod>" lastmod "</lastmod>
    </url>

    <!-- Blog entries -->
    " (string-join
        (map (lambda (entry)
               (string-append "<url>
        <loc>" (xml-escape (entry-full-url entry)) "</loc>
        <lastmod>" (or (date-iso (entry-date entry)) lastmod) "</lastmod>
    </url>"))
             indexable)
        "\n    ") "
</urlset>")))

(define (sha256-prefix path length)
  (let* ((port (open-pipe* OPEN_READ "sha256sum" path))
         (line (read-line port)))
    (close-pipe port)
    (substring line 0 length)))

(define (build-assets)
  (let* ((css (read-file css-source-path))
         (css-hash (sha256-prefix css-source-path 12))
         (css-file (string-append "index." css-hash ".css"))
         (css-output (string-append assets-output-path "/" css-file)))
    (mkdir-p assets-output-path)
    (write-file css-output css)
    (copy-directory branding-source-path (string-append assets-output-path "/branding"))
    (string-append "/assets/" css-file)))

(define (write-rendered-page template output-path render-page)
  (call-with-values
      render-page
    (lambda (head body)
      (write-file output-path (apply-template template head body)))))

(define (start-public-copy)
  (call-with-new-thread
   (lambda ()
     (copy-directory "public" "dist"))))

(define (build)
  (remove-tree "dist")
  (mkdir-p "dist")
  (let* ((public-copy-thread (start-public-copy))
         (stylesheet-path (build-assets))
         (template (string-replace-all (read-file "src/template.html")
                                       "<!-- STYLESHEET_PATH_PLACEHOLDER -->"
                                       stylesheet-path))
         (entries (load-entries)))
    (n-par-map
     4
     (lambda (entry)
       (write-rendered-page template
                            (string-append "dist/" (entry-url entry) "/index.html")
                            (lambda () (render-entry-page entry))))
     entries)
    (write-rendered-page template "dist/index.html" (lambda () (render-index entries)))
    (write-rendered-page template "dist/contact/index.html" render-contact-page)
    (write-rendered-page template "dist/impressum/index.html" render-impressum-page)
    (write-file "dist/rss.xml" (render-rss entries))
    (display "RSS feed generated at dist/rss.xml\n")
    (write-file "dist/sitemap.xml" (render-sitemap entries))
    (display "Sitemap generated at dist/sitemap.xml\n")
    (join-thread public-copy-thread)))

(build)
