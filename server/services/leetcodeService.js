import axios from 'axios';
import * as cheerio from 'cheerio'; // you might need to parse HTML

export const fetchLeetCodeData = async (username) => {
  try {
    const url = `https://leetcode.com/u/${username}/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Example: extract badges or stats from the page (LeetCode doesn’t have public API)
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
