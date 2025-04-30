// src/utils/url.js

/**
 * 格式化链接，确保以 http(s):// 开头
 * @param {string} link
 * @returns {string}
 */
export function formatLink(link) {
    if (!link) return '#'
    if (/^https?:\/\//i.test(link)) {
      return link
    }
    if (/^\/\//.test(link)) {
      return 'http:' + link
    }
    return 'https://' + link
  }