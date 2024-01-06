<h3>/re-test</h3>
<div>Test if a text matches a regular expression.</div>
<div>Simple test:</div>
<pre><code>/re-test find=/dog/i The quick brown fox jumps over the lazy dog. | /echo</code></pre>
<div>Pipes need to be escaped:</div>
<pre><code>/re-test find=/dog\|cat/i The quick brown fox jumps over the lazy dog. | /echo</code></pre>
<hr>

<h3>/re-replace</h3>
<div>Find and replace with regular expressions.</div>
<div>Simple find-replace:</div>
<pre><code>/re-replace find=/dog/i replace=cat The quick brown fox jumps over the lazy dog. | /echo</code></pre>
<div>Use <code>$1</code>, <code>$2</code>, ... to reference capturing groups:</div>
<pre><code>/re-replace find="/(\\w+)\\b dog/i" replace="$1 cat" The quick brown fox jumps over the lazy dog. | /echo</code></pre>
<div>Replace matching parts with the result of other slash commands:</div>
<pre><code>/re-replace find="/(fox\|dog)/ig" cmd="/input replace $1 with:" The quick brown fox jumps over the lazy dog. | /echo</code></pre>
