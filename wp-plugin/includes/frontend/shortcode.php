<?php
add_shortcode('wp-live-search', function () {
  ob_start();
  ?>
  <div data-livesearch id="live-search">
    <button aria-expanded="false" data-livesearch-button type="button" title="Open search">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
        class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
      </svg>
    </button>
    <div data-livesearch-wrapper>
      <input data-livesearch-input type="text" placeholder="Search..." />
      <div data-livesearch-container></div>
    </div>
  </div>
  <?php
  return ob_get_clean();
})
  ?>