import axios from 'axios';
import * as cheerio from 'cheerio';

const PROFILE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const fetchProfilePage = async (username) => {
  const safeUsername = encodeURIComponent(String(username).trim());
  const url = `https://www.codechef.com/users/${safeUsername}`;
  const response = await axios.get(url, {
    timeout: 15000,
    maxRedirects: 0,
    validateStatus: (s) => s >= 200 && s < 400,
    headers: PROFILE_HEADERS,
  });

  // CodeChef redirects unknown users to the homepage
  if (response.status >= 300) {
    return { exists: false, html: null };
  }
  return { exists: true, html: String(response.data || '') };
};

const extractRating = ($) => {
  // Try common selectors for the rating number on the profile page
  const candidates = [
    $('.rating-number').first().text().trim(),
    $('[class*="rating"]').filter((_, el) => /^\d+$/.test($(el).text().trim())).first().text().trim(),
  ];
  for (const c of candidates) {
    const n = parseInt(c, 10);
    if (!isNaN(n) && n > 0) return n;
  }
  // Fallback: look for "Rating" label followed by a number in text
  const text = $('body').text();
  const m = text.match(/rating[^\d]{0,20}(\d{3,5})/i);
  return m ? parseInt(m[1], 10) : null;
};

const extractStars = ($) => {
  const text = $('body').text();
  const m = text.match(/(\d)\s*(?:star|★)/i) || text.match(/stars?[^\d]{0,10}(\d)/i);
  return m ? parseInt(m[1], 10) : null;
};

export const fetchCodeChefData = async (username) => {
  const cleanUsername = String(username).trim();
  try {
    const { exists, html } = await fetchProfilePage(cleanUsername);
    if (!exists) {
      return { username: cleanUsername, found: false };
    }

    const $ = cheerio.load(html);
    const rating = extractRating($);
    const stars = extractStars($);

    return {
      username: cleanUsername,
      found: true,
      rating,
      stars,
      profileUrl: `https://www.codechef.com/users/${encodeURIComponent(cleanUsername)}`,
    };
  } catch (err) {
    console.error('CodeChef fetch error:', err.message);
    return { username: cleanUsername, found: false };
  }
};

export const verifyCodeChefOwnership = async (username, verificationCode) => {
  try {
    const { exists, html } = await fetchProfilePage(username);
    if (!exists) return false;

    const htmlContent = html.toLowerCase();
    const codeToFind = String(verificationCode).toLowerCase();
    return htmlContent.includes(codeToFind);
  } catch (err) {
    console.error('CodeChef verification error:', err.message);
    return false;
  }
};
