import axios from 'axios';
import * as cheerio from 'cheerio'; 

export const fetchLeetCodeData = async (username) => {
  try {
    const safeUsername = encodeURIComponent(String(username).trim());
    const url = `https://leetcode.com/u/${safeUsername}/`;
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Orbito-Portfolio-Engine/1.0' }
    });
    const $ = cheerio.load(data);

    const badges = [];
    $('.badge-item').each((_, el) => {
      badges.push({
        name: $(el).find('.badge-name').text(),
        image: $(el).find('img').attr('src')
      });
    });

    return badges;
  } catch (err) {
    console.error('LeetCode fetch error:', err.message);
    return [];
  }
};

export const verifyLeetCodeOwnership = async (username, verificationCode) => {
  try {
    const safeUsername = encodeURIComponent(String(username).trim());
    const url = `https://leetcode.com/u/${safeUsername}/`;
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Orbito-Portfolio-Engine/1.0' }
    });
    
    const htmlContent = String(data).toLowerCase();
    const codeToFind = String(verificationCode).toLowerCase();
    
    return htmlContent.includes(codeToFind);
  } catch (err) {
    console.error('LeetCode verification error:', err.message);
    return false;
  }
};
