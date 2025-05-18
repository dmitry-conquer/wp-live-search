<?php
if (!defined('ABSPATH')) {
  die;
}

class ZEN_SettingsPage
{

  private array $fields = [];

  public function __construct()
  {
    $this->fields = require ZEN_PLUGIN_PATH . 'includes/admin/settings-fields.php';
    add_action('admin_menu', [$this, 'register_settings_page']);
    add_action('admin_init', [$this, 'register_settings']);
  }

  public function register_settings_page()
  {
    add_menu_page(
      'WP Live Search Settings Page',
      'WP Live Search',
      'manage_options',
      'zen_settings_page',
      [$this, 'zen_page'],
      'dashicons-admin-multisite',
      100
    );
  }

  public function register_settings()
  {
    register_setting('zen_settings', 'zen_settings_options');
    add_settings_section('zen_settings_section', 'Settings', [$this, 'settings_section_html'], 'zen_settings_page');
    foreach ($this->fields as $field_id => $field) {
      add_settings_field(
        $field_id,
        $field['label'],
        [$this, 'render_field'],
        'zen_settings_page',
        'zen_settings_section',
        ['id' => $field_id, 'type' => $field['type'], 'default' => $field['default']]
      );
    }
  }

  public function render_field(array $args)
  {
    $field_id = esc_attr($args['id']);
    $field_default = $args['default'];
    $field_type = $args['type'];
    $options = get_option('zen_settings_options', []);
    $value = $options[$field_id] ?? $field_default ?? '';

    if ($field_type === 'checkbox') {
      $checked = checked($value, '1', false);
      echo "<input type='checkbox' id='{$field_id}' name='zen_settings_options[{$field_id}]' value='1' {$checked} />";
    } else if ($field_type === 'checkbox_list') {
      $post_types = get_post_types(['public'=> true], 'objects');
      foreach ($post_types as $post_type) {
        $post_type_name = esc_attr($post_type->name);
        $checked = in_array($post_type_name, (array) $value) ? 'checked' : '';
        echo "<label>
        <input type='checkbox' name='zen_settings_options[{$field_id}][]' value='{$post_type_name}' {$checked}>
        {$post_type->label}
          </label><br>";
      } 
    } else if ($field_type === 'textarea') {
      echo "<textarea type='{$field_type}' id='{$field_id}' name='zen_settings_options[{$field_id}]'>" . esc_attr($value) . "</textarea>";
    }
     else {
      echo "<input type='{$field_type}' id='{$field_id}' name='zen_settings_options[{$field_id}]' value='" . esc_attr($value) . "' />";
    }
  }

  public function settings_section_html(){
    echo 'Section title';
}


  public function zen_page()
  {
    require_once ZEN_PLUGIN_PATH . 'includes/admin/templates/settings-page.php';
  }
}
