<?php

if (!defined('ABSPATH')) {
  exit;
}

return [
  'show_results' => [
      'label' => 'Show results',
      'type' => 'number',
      'default' => 1,
  ],
  'post_types_to_search' => [
      'label' => 'Enabled post types to search',
      'type' => 'checkbox_list',
      'default' => ['post', 'page'],
  ],
  'exclude_key_words' => [
    'label' => 'Exclude from search',
    'type' => 'textarea',
    'default' => 'thankyou, thank you',
],
];