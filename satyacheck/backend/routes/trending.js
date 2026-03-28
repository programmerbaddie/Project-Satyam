const express = require('express');
const router = express.Router();

const TRENDING_FAKE_NEWS = [
  {
    id: 1,
    topic: 'Free ₹5000 CPUC Electricity Bill Subsidy 2025',
    category: 'Business',
    region: 'India',
    preview: 'Viral message claims government is providing ₹5000 subsidy on electricity bills...'
  },
  {
    id: 2,
    topic: 'PM Kisan ₹2000 Double Payment December',
    category: 'Agriculture',
    region: 'India',
    preview: 'Messages circulating claiming PM Kisan farmers will receive ₹2000 double payment...'
  },
  {
    id: 3,
    topic: 'WhatsApp Gold Malware Warning',
    category: 'Technology',
    region: 'Global',
    preview: 'Forward claims installing WhatsApp Gold will give extra features but contains malware...'
  },
  {
    id: 4,
    topic: 'Aadhaar Linked to Bank Account Mandatory Update',
    category: 'Finance',
    region: 'India',
    preview: 'Fake RBI notice claims Aadhaar must be linked to all bank accounts within 30 days...'
  },
  {
    id: 5,
    topic: 'COVID Vaccine Magnetic Effect',
    category: 'Health',
    region: 'India',
    preview: 'Videos claiming vaccines make people magnetic and attract metal objects...'
  },
  {
    id: 6,
    topic: 'LIC ₹5 Lakh Policy for Every Family',
    category: 'Finance',
    region: 'India',
    preview: 'Viral post claims LIC is giving ₹5 lakh policy free to every Indian family...'
  }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: TRENDING_FAKE_NEWS,
    lastUpdated: new Date().toISOString()
  });
});

router.get('/:id', (req, res) => {
  const item = TRENDING_FAKE_NEWS.find(n => n.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json({ success: true, data: item });
});

module.exports = router;