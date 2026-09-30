/* Enhance native post controls without replacing their nodes, handlers or counters. */
(() => {
  'use strict';
  const svgNS = 'http://www.w3.org/2000/svg';
  // Match the shell icons: 24px grid, unfilled geometry, rounded stroke ends.
  const paths = {
    like: '<path d="M7 10v11H3V10h4Zm0 0 5-7c2 0 3 1 2 4l-1 3h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7"/>',
    dislike: '<path d="M7 14V3H3v11h4Zm0 0 5 7c2 0 3-1 2-4l-1-3h6a2 2 0 0 0 2-2l-2-7a2 2 0 0 0-2-2H7"/>',
    follow: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2m0-11h6m-3-3v6"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    qr: '<path d="M3 3h6v6H3Zm12 0h6v6h-6ZM3 15h6v6H3Zm12 0h3v3h3m-6 0v3h3m3-9v3m-9-3h3M3 12h3m6-9v3m0 12v3"/>',
    left: '<path d="m14 6-6 6 6 6"/>',
    right: '<path d="m10 6 6 6-6 6"/>',
    comment: '<path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9Z"/>',
    bold: '<path d="M6 12h8a4.5 4.5 0 0 1 0 9H6V3h7a4.5 4.5 0 0 1 0 9"/>',
    link: '<path d="m10 7 3-3a5 5 0 0 1 7 7l-3 3M7 10l-3 3a5 5 0 0 0 7 7l3-3m-6-1 8-8"/>',
    code: '<path d="m7 6-5 6 5 6m10-12 5 6-5 6M14 3l-4 18"/>',
    quote: '<path d="M10 5H3v8h7V5Zm11 0h-7v8h7V5ZM10 13c0 4-2 6-5 6m16-6c0 4-2 6-5 6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    completion: '<path d="M7 4C2 6 2 18 7 20m10-16c5 2 5 14 0 16M10 2h4m-2 0v20m-2 0h4"/>',
    completionOff: '<path d="M7 4C2 6 2 18 7 20m10-16c5 2 5 14 0 16M10 2h4m-2 0v4m0 12v4m-2 0h4M3 3l18 18"/>'
  };
  const actions = {
    green_channel_digg: 'like', green_channel_follow: 'follow',
    green_channel_favorite: 'bookmark', green_channel_wechat: 'qr',
    ubb_bold: 'bold', ubb_url: 'link', ubb_code: 'code',
    ubb_quote: 'quote', ubb_img: 'image'
  };
  const keyboardReady = new WeakSet();

  function icon(name) {
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('blog-post-icon');
    svg.innerHTML = paths[name];
    return svg;
  }

  function keyboardButton(control) {
    if (control.matches('button, input') || keyboardReady.has(control)) return;
    control.setAttribute('role', 'button');
    control.tabIndex = 0;
    control.addEventListener('keydown', event => {
      if (event.target !== control || event.repeat || event.defaultPrevented) return;
      // Anchors already activate once on Enter; divs and spans need both keys.
      if (event.key !== ' ' && (event.key !== 'Enter' || control.matches('a[href]'))) return;
      event.preventDefault();
      if (control.getAttribute('aria-disabled') !== 'true') control.click();
    });
    keyboardReady.add(control);
  }

  function enhance(control) {
    const name = actions[control.id];
    if (name) {
      if (!control.querySelector(':scope > .blog-post-icon')) {
        // Only the editor's decorative artwork changes; its clickable span stays.
        if (control.classList.contains('comment_icon')) {
          control.querySelectorAll(':scope > svg').forEach(svg => svg.remove());
        }
        control.prepend(icon(name));
      }
      keyboardButton(control);
      if (control.classList.contains('comment_icon')) {
        control.setAttribute('aria-label', control.getAttribute('alt') || control.title);
      }
    }
    if (control.matches('#div_digg .diggit, #div_digg .buryit')) {
      const positive = control.classList.contains('diggit');
      const label = positive ? '推荐' : '反对';
      if (!control.querySelector(':scope > .blog-post-icon')) control.prepend(icon(positive ? 'like' : 'dislike'));
      if (!control.querySelector('.blog-vote-label')) {
        const text = document.createElement('span');
        text.className = 'blog-vote-label';
        text.textContent = label;
        control.querySelector('.blog-post-icon').after(text);
      }
      control.setAttribute('aria-label', label + '文章');
      control.setAttribute('aria-describedby', positive ? 'digg_count' : 'bury_count');
      keyboardButton(control);
    }
    if (control.matches('#blog_post_info, #comment_form .commentbox_main')) control.classList.add('blog-outline-card');
    if (control.matches('#commentform_title label') && !control.querySelector('.blog-post-icon')) control.prepend(icon('comment'));
    if (control.matches('#post_next_prev .p_n_p_prefix') && !control.querySelector('.blog-post-icon')) {
      const next = control.textContent.includes('»');
      control.replaceChildren(icon(next ? 'right' : 'left'));
      control.setAttribute('aria-label', next ? '下一篇' : '上一篇');
    }
    if (control.matches('#comment_form .commentbox_tab, #ubb_auto_completion')) keyboardButton(control);
    if (control.matches('#comment_auto_completion_on, #comment_auto_completion_off') && !control.classList.contains('blog-post-icon')) {
      control.setAttribute('viewBox', '0 0 24 24');
      control.setAttribute('aria-hidden', 'true');
      control.classList.add('blog-post-icon');
      control.innerHTML = paths[control.id.endsWith('_off') ? 'completionOff' : 'completion'];
    }
    if (control.id === 'tbCommentBody' && !control.hasAttribute('aria-label')) control.setAttribute('aria-label', '评论内容');
    if (control.matches('#author_profile_info > a') && !control.textContent.trim()) control.setAttribute('aria-label', '作者主页');
  }

  const selector = [
    ...Object.keys(actions).map(id => '#' + id),
    '#div_digg .diggit', '#div_digg .buryit', '#blog_post_info',
    '#comment_form .commentbox_main', '#commentform_title label',
    '#post_next_prev .p_n_p_prefix', '#comment_form .commentbox_tab',
    '#ubb_auto_completion', '#comment_auto_completion_on', '#comment_auto_completion_off',
    '#tbCommentBody', '#author_profile_info > a'
  ].join(',');
  function scan(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches(selector)) enhance(node);
    node.querySelectorAll(selector).forEach(enhance);
  }
  function start() {
    const region = document.querySelector('#mainContent');
    if (!region) return;
    scan(region);
    // The platform fills post actions and the comment editor asynchronously.
    new MutationObserver(records => {
      const roots = new Set(records.map(record => record.target));
      roots.forEach(scan);
    }).observe(region, { childList: true, subtree: true });
  }
  if (document.querySelector('#mainContent')) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
