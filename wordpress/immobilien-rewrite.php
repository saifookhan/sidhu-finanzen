<?php
/**
 * Sidhu Finanzen — Immobilien detail URLs on WordPress
 *
 * Add to your theme functions.php (replace any previous immobilien rewrite snippet).
 *
 * Why: WordPress has no page at /immobilien/33/ and the theme redirects that
 * to /page-404/33/. This maps pretty URLs to the working query-param format.
 *
 * Works immediately — no permalink flush required.
 *
 * List:   https://sidhu-finanzen.de/immobilien/
 * Detail: https://sidhu-finanzen.de/immobilien/?immobilie=33
 * Pretty: https://sidhu-finanzen.de/immobilien/33/  → redirects to ?immobilie=33
 */

add_action('init', function () {
  if (is_admin()) {
    return;
  }

  $request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
  $path = strtok($request_uri, '?') ?: '';

  if (!preg_match('#/immobilien/(\d+)/?$#', $path, $matches)) {
    return;
  }

  wp_safe_redirect(home_url('/immobilien/?immobilie=' . $matches[1]), 301);
  exit;
}, 0);

add_filter('redirect_canonical', function ($redirect_url, $requested_url) {
  if (preg_match('#/immobilien/\d+/?(\?.*)?$#', (string) $requested_url)) {
    return false;
  }

  return $redirect_url;
}, 10, 2);
