<h1>PLUGIN PAGE SETTINGS</h1>
<?php settings_errors(); ?>
<form action="options.php" method="post">
  <?php settings_fields('zen_settings');
  do_settings_sections('zen_settings_page');
  submit_button();
  ?>
</form>