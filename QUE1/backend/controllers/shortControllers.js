
const Url=require('../models/Url');
const crypto=require('crypto');
const genShortCode = () => crypto.randomBytes(3).toString('hex');
const makeShortUrl=async(req,res) => {
  try {  
    const {url,validity=30,shortcode}=req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    let code = shortcode || genShortCode();
    let exists = await Url.findOne({ shortCode: code });
    if (exists) return res.status(409).json({ error: 'Shortcode already exists' });
    const expiry = new Date(Date.now() + validity * 60000);
    const newUrl = await Url.create({
      originalUrl: url,
      shortCode: code,
      expiry,
    });
    res.status(201).json({
      shortLink: `http://localhost:4000/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const redirectToLongUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortCode: shortcode });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });
    if (new Date() > urlDoc.expiry) return res.status(410).json({ error: 'Link expired' });
    urlDoc.clicks.push({
      referrer: req.get('Referrer') || 'unknown',
      location: req.ip,
    });
    await urlDoc.save();
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortCode: shortcode });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });
    res.json({
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      expiry: urlDoc.expiry,
      totalClicks: urlDoc.clicks.length,
      clickDetails: urlDoc.clicks,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { makeShortUrl, redirectToLongUrl, getStats };
