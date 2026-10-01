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
    completionOff: '<path d="M7 4C2 6 2 18 7 20m10-16c5 2 5 14 0 16M10 2h4m-2 0v4m0 12v4m-2 0h4M3 3l18 18"/>',
    edit: '<path d="M14 3H4v18h16v-7M8 8h3m-3 5h2m-2 4h7m1-14 5 5m-8 3 6-6 3 3-6 6-4 1 1-4Z"/>',
    preview: '<path d="M14 3H4v18h16v-3M8 7h5m-5 5h1m-1 5h5"/><path d="M10 12s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4Z"/><circle cx="16" cy="12" r="1.5"/>'
  };
  const actions = {
    green_channel_digg: 'like', green_channel_follow: 'follow',
    green_channel_favorite: 'bookmark', green_channel_wechat: 'qr',
    ubb_bold: 'bold', ubb_url: 'link', ubb_code: 'code',
    ubb_quote: 'quote', ubb_img: 'image'
  };
  const keyboardReady = new WeakSet();

  function labelText(control, className) {
    let label = control.querySelector(':scope > .' + className);
    if (!label) {
      label = document.createElement('span');
      label.className = className;
      // Move the original text; native click targets and attached handlers stay.
      Array.from(control.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        .forEach(node => label.append(node));
      control.append(label);
    }
    return label;
  }

  function updateTab(control) {
    const pressed = String(control.classList.contains('active'));
    if (control.getAttribute('aria-pressed') !== pressed) control.setAttribute('aria-pressed', pressed);
  }

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
      if (control.id.startsWith('green_channel_')) {
        const label = labelText(control, 'blog-action-label').textContent.trim();
        if (label) {
          control.setAttribute('aria-label', label);
          if (!control.title) control.title = label;
        }
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
    if (control.matches('#blog_post_info, #comment_form .commentbox_main') && !control.classList.contains('blog-outline-card')) control.classList.add('blog-outline-card');
    if (control.matches('#commentform_title label') && !control.querySelector('.blog-post-icon')) control.prepend(icon('comment'));
    if (control.matches('#btn_edit_comment, #btn_preview_comment')) {
      if (!control.querySelector(':scope > .blog-post-icon')) control.prepend(icon(control.id === 'btn_edit_comment' ? 'edit' : 'preview'));
      labelText(control, 'blog-comment-tab-label');
      control.setAttribute('aria-controls', control.id === 'btn_edit_comment' ? 'tbCommentBody' : 'tbCommentBodyPreview');
      updateTab(control);
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
    if (control.id === 'digg_tips') {
      const hidden = !control.textContent.trim();
      if (control.hidden !== hidden) control.hidden = hidden;
    }
  }

  function enhancePostNavigation() {
    const nav = document.querySelector('#post_next_prev');
    if (!nav) return;
    let prev = nav.querySelector(':scope > .blog-post-prev');
    let next = nav.querySelector(':scope > .blog-post-next');
    if (!prev) {
      prev = document.createElement('div');
      prev.className = 'blog-post-prev';
      nav.append(prev);
    }
    if (!next) {
      next = document.createElement('div');
      next.className = 'blog-post-next';
      nav.append(next);
    }
    nav.querySelectorAll(':scope > .p_n_p_prefix').forEach(prefix => {
      const isNext = prefix.getAttribute('aria-label') === '下一篇' || prefix.textContent.includes('»');
      const label = isNext ? '下一篇' : '上一篇';
      const wrapper = isNext ? next : prev;
      const siblings = [];
      let sibling = prefix.nextSibling;
      while (sibling && !(sibling.nodeType === Node.ELEMENT_NODE && sibling.matches('br, .p_n_p_prefix, .blog-post-prev, .blog-post-next, .blog-post-license'))) {
        siblings.push(sibling);
        sibling = sibling.nextSibling;
      }
      // Preserve both native anchors, including their hrefs and click handlers.
      prefix.replaceChildren(icon(isNext ? 'right' : 'left'));
      const text = document.createElement('span');
      text.className = 'blog-post-nav-label';
      text.textContent = label;
      prefix.append(text);
      prefix.setAttribute('aria-label', label);
      wrapper.append(prefix);
      siblings.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('a')) {
          node.classList.add('blog-post-nav-title');
          wrapper.append(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          // The platform's separate "上一篇：" / "下一篇：" text is now in the anchor.
          if (!node.textContent.trim() || /^(?:上一篇|下一篇)\s*[：:]?\s*$/.test(node.textContent.trim())) node.remove();
        }
      });
    });
    nav.querySelectorAll(':scope > br').forEach(br => br.remove());
    let license = nav.querySelector(':scope > .blog-post-license');
    if (!license) {
      license = document.createElement('div');
      license.className = 'blog-post-license';
      const label = document.createElement('span');
      label.className = 'blog-license-label';
      label.textContent = '版权协议：';
      const link = document.createElement('a');
      link.href = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
      link.textContent = 'CC BY-NC-SA 4.0';
      license.append(label, link);
      nav.insertBefore(license, next);
    }
  }

  function enhanceCommentEditor() {
    const form = document.querySelector('#comment_form');
    if (!form) return;
    const tabs = form.querySelector('.commentbox_title_left');
    if (tabs && !tabs.classList.contains('blog-comment-tabs')) {
      tabs.classList.add('blog-comment-tabs');
      tabs.setAttribute('role', 'group');
      tabs.setAttribute('aria-label', '评论模式');
    }
    const footer = form.querySelector('.commentbox_footer');
    const options = form.querySelector('#commentbox_opt');
    if (footer && options && options.parentElement !== footer) footer.prepend(options);
    if (footer) {
      Array.from(footer.children).filter(child => child.matches('span:not([id])') && !child.textContent.trim() && !child.children.length)
        .forEach(child => child.remove());
    }
    form.querySelectorAll('#comment_form_container > p').forEach(paragraph => {
      if (/^\[Ctrl\+Enter快捷键提交\]$/.test(paragraph.textContent.trim()) && !paragraph.hidden) {
        paragraph.classList.add('blog-comment-shortcut-hint');
        paragraph.hidden = true;
      }
    });
  }

  function emptyCommentHeader() {
    const header = document.createElement('div');
    header.className = 'feedback_area_title';
    header.textContent = '评论列表';
    const sort = document.createElement('div');
    sort.id = 'comment_sort';
    sort.className = 'comment-sort';
    sort.title = '切换评论排序';
    const order = document.createElement('div');
    order.className = 'comment-order-tab';
    const manager = window.commentManager;
    const supportFirst = manager && manager.getFromHash('order') === '1';
    const items = [['comment_default_list', '默认'], ['comment_sort_order_time', '按时间'], ['comment_sort_order_digg', '按支持数']];
    items.forEach(([id, label], index) => {
      if (index) {
        const divider = document.createElement('span');
        divider.textContent = '|';
        order.append(divider);
      }
      const control = document.createElement('span');
      control.id = id;
      control.className = 'comment-sort-label comment-sort-item';
      control.textContent = label;
      if (id === (supportFirst ? 'comment_sort_order_digg' : 'comment_sort_order_time')) control.classList.add('active');
      keyboardButton(control);
      control.addEventListener('click', event => {
        event.stopPropagation();
        const native = window.commentManager;
        if (!native || typeof native.renderComments !== 'function') return;
        if (id === 'comment_default_list') {
          history.replaceState('', '', location.pathname + '#!comments');
          native.renderComments(0);
          return;
        }
        const descending = native.getFromHash('desc') === 'true';
        native.addToHash('order', id === 'comment_sort_order_digg' ? 1 : 0);
        native.addToHash('desc', control.classList.contains('active') ? !descending : true);
        native.renderComments(1);
      });
      order.append(control);
    });
    sort.append(order);
    header.append(sort);
    return header;
  }

  function enhanceEmptyComments() {
    const placeholder = document.querySelector('#blog-comments-placeholder');
    const count = document.querySelector('#post_comment_count');
    if (!placeholder || !count) return;
    const emptyState = placeholder.querySelector('.blog-comments-empty');
    // Native submission appends the first comment to #divCommentShow without
    // updating the count. Remove our empty message as soon as that body exists.
    const recentComment = document.querySelector('#divCommentShow .blog_comment_body, #divCommentShow .comment_my_posted');
    if (count.textContent.trim() !== '0' || recentComment) {
      if (emptyState) emptyState.remove();
      return;
    }
    // The native success callback sets the actual count, clears the loading
    // markup and loads the editor. Never replace a loading or error message.
    // The platform's misspelled flag also covers login notices and disabled
    // comment forms; those readers still need the empty list heading.
    const manager = window.commentManager;
    if (!(manager && manager.isCommentBoxLoaed === true) && !document.querySelector('#comment_form_container .commentbox_main')) return;
    if (emptyState) return;
    if (placeholder.childElementCount || placeholder.textContent.trim()) return;
    const empty = document.createElement('div');
    empty.className = 'blog-comments-empty';
    empty.textContent = '虚位以待';
    placeholder.append(emptyCommentHeader(), empty);
  }

  const selector = [
    ...Object.keys(actions).map(id => '#' + id),
    '#div_digg .diggit', '#div_digg .buryit', '#blog_post_info',
    '#comment_form .commentbox_main', '#commentform_title label',
    '#comment_form .commentbox_tab',
    '#ubb_auto_completion', '#comment_auto_completion_on', '#comment_auto_completion_off',
    '#tbCommentBody', '#author_profile_info > a', '#digg_tips'
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
    enhancePostNavigation();
    enhanceCommentEditor();
    enhanceEmptyComments();
    // The platform fills post actions and the comment editor asynchronously.
    new MutationObserver(records => {
      const roots = new Set();
      records.forEach(record => {
        if (record.type === 'attributes') {
          if (record.target.matches('#btn_edit_comment, #btn_preview_comment')) updateTab(record.target);
        } else roots.add(record.target);
      });
      roots.forEach(scan);
      if (roots.size) {
        enhancePostNavigation();
        enhanceCommentEditor();
        enhanceEmptyComments();
      }
    }).observe(region, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }
  if (document.querySelector('#mainContent')) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
