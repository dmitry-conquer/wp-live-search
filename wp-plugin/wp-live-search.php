<?php
/**
 * Plugin Name: WP Live Search
 * Description: WP Live Search by Dmitry Frolov
 * Version:     1.0.0
 * Author:      Dmitry Frolov
 */

if (!defined('ABSPATH')) {
  die;
}

define('ZEN_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('ZEN_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ZEN_PLUGIN_BASENAME', plugin_basename(__FILE__));

require_once ZEN_PLUGIN_PATH . 'includes/admin/admin-settings.php';
require_once ZEN_PLUGIN_PATH . 'includes/admin/settings-page.php';
require_once ZEN_PLUGIN_PATH . 'includes/admin/enqueue-assets.php';
require_once ZEN_PLUGIN_PATH . 'includes/frontend/shortcode.php';

function zen_plugin_init()
{
  new ZEN_AdminSettings();
  new ZEN_SettingsPage();
  new ZEN_EnqueueAssets();
}
// Initialize the plugin's admin settings, settings page, and enqueue assets when all plugins are loaded.
add_action('plugins_loaded', 'zen_plugin_init');
