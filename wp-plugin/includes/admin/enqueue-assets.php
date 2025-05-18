<?php

if (!defined('ABSPATH')) {
  die;
}

class ZEN_EnqueueAssets {
  
  public function __construct() {
    add_action('admin_enqueue_scripts', [$this, 'enqueue_admin']);
    add_action('wp_enqueue_scripts', [$this, 'enqueue_front']);
  }

  private function enqueue_assets($type) {
    $base_url = ZEN_PLUGIN_URL . "assets/$type/";
    $base_path = ZEN_PLUGIN_PATH . "assets/$type/";

    $styles = [
      'styles'  => ['file' => 'styles/style.css', 'handle' => "zen-{$type}-styles"],
    ];
    $scripts = [
      'scripts' => ['file' => 'scripts/script.js', 'handle' => "zen-{$type}-scripts"],
    ];

    foreach ($styles as $style) {
      $file_url = $base_url . $style["file"];
      $file_path = $base_path . $style["file"];
      $handle = $style['handle'];
      wp_enqueue_style($handle, $file_url, [], file_exists($file_path) ? filemtime($file_path) : '1.0.0');
    }
    foreach ($scripts as $script) {
      $file_url = $base_url . $script["file"];
      $file_path = $base_path . $script["file"];
      $handle = $script['handle'];
      wp_enqueue_script($handle, $file_url, [], file_exists($file_path) ? filemtime($file_path) : '1.0.0');
    }
  }

  public function enqueue_admin() {
    $this->enqueue_assets('admin');
  }

  public function enqueue_front() {
    $this->enqueue_assets('front');
    wp_localize_script('zen-front-scripts', 'ajax_obj', [
      'ajax_url' => admin_url('admin-ajax.php'),
    ]);
  }
}
