<?php

if (!defined('ABSPATH')) {
  exit;
}

function map_post_types($options, $fields)
{
  $post_type_map = [
    'post' => 'posts',
    'page' => 'pages',
    'attachment' => 'media',
    'user' => 'users',
  ];

  $post_types_to_search = $options['post_types_to_search'] ?? $fields['post_types_to_search']['default'];

  return array_map(fn($post_type) => $post_type_map[$post_type] ?? $post_type, $post_types_to_search);
}