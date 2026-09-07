/* Keep the original image node (and its zoom/link behavior) inside a corner frame. */
(() => {
  'use strict';
  const images = '#cnblogs_post_body img:not(.blog-link-favicon-slot img), .postCon img';

  function wrap(image) {
    if (image.closest('.blog-image-frame, .blog-link-favicon-slot')) return;
    const frame = document.createElement('span');
    frame.className = 'blog-image-frame blog-outline-card';
    if (image.classList.contains('desc_img')) frame.classList.add('blog-image-frame--summary');
    image.before(frame);
    frame.append(image);
  }

  function scan(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches(images)) wrap(node);
    node.querySelectorAll(images).forEach(wrap);
  }

  function start() {
    document.querySelectorAll('#home #cnblogs_post_body, #home .postCon').forEach(region => {
      scan(region);
      new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(scan));
      }).observe(region, { childList: true, subtree: true });
    });
  }

  if (document.querySelector('#home')) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
