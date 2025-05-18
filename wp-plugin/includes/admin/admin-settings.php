<?php

if (!defined('ABSPATH')) {
  die;
}

require_once ZEN_PLUGIN_PATH . 'includes/admin/functions.php';

class ZEN_AdminSettings
{
  public function __construct()
  {
    add_action('wp_ajax_get_search_data', [$this, 'get_search_data']);
    add_action('wp_ajax_nopriv_get_search_data', [$this, 'get_search_data']);
    add_filter('plugin_action_links_' . ZEN_PLUGIN_BASENAME, [$this, 'add_plugin_setting_link']);
  }

  public function add_plugin_setting_link($links)
  {
    $custom_link = '<a href="admin.php?page=zen_settings_page">Settings</a>';
    array_push($links, $custom_link);
    return $links;
  }

  public function get_search_data()
  {
    $options = get_option('zen_settings_options', []);
    $fields = require ZEN_PLUGIN_PATH . 'includes/admin/settings-fields.php';
   
    foreach ($fields as $key => $field) {
      $data[$key] = $options[$key] ?? $field['default'];
    }

    $data['site_name'] = parse_url(site_url(), PHP_URL_HOST);
    $data['post_types_to_search'] = map_post_types($options, $fields);

    wp_send_json($data);
  }
}
