<?php
/**
 * Optional WordPress rewrite for pretty property URLs:
 * https://sidhu-finanzen.de/immobilien/33/
 *
 * Add to your theme functions.php, then flush permalinks once:
 * Settings → Permalinks → Save Changes
 *
 * Note: query-param URLs (?immobilie=33) work without this snippet.
 */

add_action('init', function () {
  add_rewrite_rule(
    '^immobilien/([0-9]+)/?$',
    'index.php?pagename=immobilien',
    'top'
  );
});
