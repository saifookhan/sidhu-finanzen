<?php
/**
 * Sidhu Finanzen — detail URL redirects for kaufen and mieten WordPress pages.
 *
 * Add to your theme functions.php.
 *
 * List pages:
 * - https://sidhu-finanzen.de/immobilien-kaufen/
 * - https://sidhu-finanzen.de/immobilien-mieten/
 *
 * Detail pages:
 * - https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=33
 * - https://sidhu-finanzen.de/immobilien-mieten/?immobilie=33
 */

add_action('init', function () {
  if (is_admin()) {
    return;
  }

  $request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
  $path = strtok($request_uri, '?') ?: '';

  $routes = [
    '/immobilien-kaufen' => '/immobilien-kaufen/',
    '/immobilien-mieten' => '/immobilien-mieten/',
    '/immobilien' => '/immobilien-kaufen/',
  ];

  foreach ($routes as $legacyPath => $targetListPath) {
    if (!preg_match('#' . preg_quote($legacyPath, '#') . '/(\d+)/?$#', $path, $matches)) {
      continue;
    }

    wp_safe_redirect(home_url($targetListPath . '?immobilie=' . $matches[1]), 301);
    exit;
  }
}, 0);

add_filter('redirect_canonical', function ($redirect_url, $requested_url) {
  if (preg_match('#/immobilien(?:-kaufen|-mieten)?/\d+/?(\?.*)?$#', (string) $requested_url)) {
    return false;
  }

  return $redirect_url;
}, 10, 2);
