import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Pre-configured official Store FAQ knowledge base
const STORE_FAQS = {
  delivery: {
    patterns: [/delivery/i, /ship/i, /courier/i, /how long/i, /transit/i, /when will (it|i) receive/i],
    response:
      '📦 **Delivery Policy**: Orders are carefully hand-bottled and dispatched within 24 hours. We partner with express insured couriers (Bluedart, Delhivery, DTDC). Metro deliveries take **2-3 business days**, while other locations arrive in **3-5 business days**. Shipping is complimentary on all orders above ₹1,999!',
  },
  returnPolicy: {
    patterns: [/return/i, /replacement/i, /refund/i, /damaged/i, /broken/i, /exchange/i],
    response:
      '🛡️ **Returns & Integrity Policy**: Due to the hygienic and artisanal nature of concentrated attar flacons, bottles once unsealed cannot be returned. However, we provide an **immediate 100% free replacement** within 7 days if your bottle arrives damaged or leaking during transit. Just message us on WhatsApp with an unboxing clip.',
  },
  cod: {
    patterns: [/cod/i, /cash on delivery/i, /pay on delivery/i],
    response:
      '💵 **Cash on Delivery (COD)**: Yes! Cash on Delivery is gladly available across 19,000+ pin codes in India on orders up to **₹5,000**. For expedited dispatch, prepaid orders via UPI, Cards, and Netbanking are also processed instantly.',
  },
  purity: {
    patterns: [/alcohol/i, /pure/i, /natural/i, /halal/i, /synthetic/i, /chemical/i, /concentrat/i],
    response:
      '🌿 **100% Alcohol-Free Guarantee**: Every single Attar Depot creation is 100% concentrated perfume oil (Pure Ittar). Zero alcohol, zero chemical propellants, and completely Halal and prayer-safe. Our distillations use Kannauj copper Degs and hydro-distilled floral petals over Mysore sandalwood and pure wild agarwood bases.',
  },
  contact: {
    patterns: [/contact/i, /support/i, /phone/i, /email/i, /whatsapp/i, /customer care/i, /helpline/i],
    response:
      '📞 **Fragrance Concierge Support**: You can reach our master fragrance specialists directly via WhatsApp at **+91 98765 43210** or email us at **concierge@attardepot.com**. We are available Monday to Saturday from 9:30 AM to 8:00 PM IST.',
  },
};

export class AiService {
  /**
   * Main chat processing pipeline
   */
  async processMessage({ message = '', user = null, conversationId = '' }) {
    const rawMessage = message.trim();
    const lowerMessage = rawMessage.toLowerCase();

    // 1. Check for Store FAQs first
    for (const [key, faq] of Object.entries(STORE_FAQS)) {
      if (faq.patterns.some((pattern) => pattern.test(lowerMessage))) {
        return {
          message: faq.response,
          products: [],
          quickReplies: ['🔍 Find a perfume for me', '💰 Best under ₹2000', '📦 Track my order'],
          conversationId,
        };
      }
    }

    // 2. Check for Order Tracking Intent
    const isOrderQuery =
      /track/i.test(lowerMessage) ||
      /where is my order/i.test(lowerMessage) ||
      /order status/i.test(lowerMessage) ||
      /consignment/i.test(lowerMessage) ||
      /my order/i.test(lowerMessage);

    if (isOrderQuery) {
      return await this.handleOrderTracking({ message, user, conversationId });
    }

    // 3. Product Discovery & Recommendation
    return await this.handleProductRecommendation({ message, lowerMessage, conversationId });
  }

  /**
   * Order tracking logic
   */
  async handleOrderTracking({ message, user, conversationId }) {
    if (!user) {
      return {
        message:
          '🔒 **Account Verification Required**: To view your private consignment and order status, please **Sign In** to your Attar Depot account using the button on the top navigation bar. Once signed in, I can retrieve your real-time tracking details immediately!',
        products: [],
        quickReplies: ['🔍 Find a perfume for me', '🌿 Woody fragrances', '🌸 Floral fragrances'],
        conversationId,
      };
    }

    try {
      // Check if user specified an order number like #AD-12345 or numbers
      const orderNumberMatch = message.match(/(?:#|order\s*(?:id|number)?\s*:?\s*)([A-Za-z0-9-]+)/i);
      let query = { user: user._id };

      if (orderNumberMatch && orderNumberMatch[1]) {
        query.orderNumber = new RegExp(orderNumberMatch[1].trim(), 'i');
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('orderItems.product', 'name slug images price');

      if (!orders || orders.length === 0) {
        return {
          message: `Hello ${user.name.split(' ')[0]}, I couldn't locate any active orders under your account right now. If you recently placed an order, please allow a few moments or verify your order number with us!`,
          products: [],
          quickReplies: ['🔍 Explore New Fragrances', '🎁 Choose a Gift', '📞 Contact Support'],
          conversationId,
        };
      }

      const latest = orders[0];
      const itemsList = latest.orderItems.map((item) => `• ${item.name} (${item.size}) x${item.quantity}`).join('\n');
      const trackingInfo = latest.trackingNumber
        ? `\n🚚 **Airway Bill / Tracking**: #${latest.trackingNumber}`
        : '\n🚚 **Courier Status**: Packing in velvet pouch, tracking will update upon courier pickup.';

      const responseMessage =
        `✨ **Consignment Status for Order #${latest.orderNumber}**\n` +
        `• **Current Status**: **${latest.orderStatus.toUpperCase()}**\n` +
        `• **Order Date**: ${new Date(latest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
        `• **Total Value**: ₹${latest.totalPrice.toLocaleString('en-IN')}\n` +
        `• **Destination**: ${latest.shippingAddress?.city}, ${latest.shippingAddress?.state}\n` +
        trackingInfo +
        `\n\n**Items in this consignment**:\n${itemsList}`;

      return {
        message: responseMessage,
        products: [],
        quickReplies: ['🔍 Find another fragrance', '💰 Best perfumes under ₹2000', '📞 Talk to Specialist'],
        conversationId,
      };
    } catch (error) {
      console.error('[AI Order Tracking Error]', error);
      return {
        message: 'I encountered an unexpected delay checking your orders. Please check your Orders page directly or retry in a moment.',
        products: [],
        quickReplies: ['🔍 Browse perfumes', '📦 Retry'],
        conversationId,
      };
    }
  }

  /**
   * Product recommendation & Natural Language Search
   */
  async handleProductRecommendation({ message, lowerMessage, conversationId }) {
    try {
      // 1. Parse Budget
      let maxPrice = null;
      const underMatch = lowerMessage.match(/(?:under|below|less than|within|budget(?:\s*of)?)\s*(?:₹|rs\.?|inr)?\s*(\d{3,6})/i);
      if (underMatch && underMatch[1]) {
        maxPrice = parseInt(underMatch[1], 10);
      } else if (lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        maxPrice = 1500;
      } else if (lowerMessage.includes('under 2000') || lowerMessage.includes('under 2k')) {
        maxPrice = 2000;
      } else if (lowerMessage.includes('under 1500')) {
        maxPrice = 1500;
      } else if (lowerMessage.includes('under 1000') || lowerMessage.includes('under 1k')) {
        maxPrice = 1000;
      }

      // 2. Parse Fragrance Families / Notes
      const notesKeywords = [];
      if (/oud|agarwood|dehn/i.test(lowerMessage)) notesKeywords.push('Oudh', 'Agarwood');
      if (/wood|woody|sandalwood|sandal|cedar/i.test(lowerMessage)) notesKeywords.push('Wood', 'Sandalwood', 'Woody');
      if (/floral|rose|gulab|jasmine|chameli|motia/i.test(lowerMessage)) notesKeywords.push('Floral', 'Rose', 'Jasmine');
      if (/musk|musky|kasturi|mushk/i.test(lowerMessage)) notesKeywords.push('Musk', 'Kashmiri Musk', 'White Musk');
      if (/amber|ambergris|balsam/i.test(lowerMessage)) notesKeywords.push('Amber');
      if (/fresh|citrus|bergamot|lemon|aqua|water/i.test(lowerMessage)) notesKeywords.push('Fresh', 'Citrus', 'Bergamot');
      if (/spic|saffron|zafran|cardamom|clove/i.test(lowerMessage)) notesKeywords.push('Spicy', 'Saffron');

      // 3. Parse Occasions & Personality
      const isOffice = /office|work|daily|formal|day/i.test(lowerMessage);
      const isWedding = /wedding|shaadi|royal|bride|groom|festiv|eid/i.test(lowerMessage);
      const isParty = /party|date|evening|night|club/i.test(lowerMessage);
      const isGift = /gift|present|anniversary|birthday|someone/i.test(lowerMessage);
      const isLongLasting = /long\s*lasting|longevity|longlasting|sillage|projection|stay/i.test(lowerMessage);

      // Construct MongoDB query
      const filter = { isActive: { $ne: false } };

      if (maxPrice) {
        filter.price = { $lte: maxPrice };
      }

      const orConditions = [];

      if (notesKeywords.length > 0) {
        const regexPatterns = notesKeywords.map((k) => new RegExp(k, 'i'));
        orConditions.push(
          { name: { $in: regexPatterns } },
          { fragranceFamily: { $in: regexPatterns } },
          { description: { $in: regexPatterns } },
          { 'fragranceNotes.topNotes': { $in: regexPatterns } },
          { 'fragranceNotes.heartNotes': { $in: regexPatterns } },
          { 'fragranceNotes.baseNotes': { $in: regexPatterns } }
        );
      }

      if (isOffice) {
        orConditions.push(
          { fragranceFamily: { $in: [/Fresh/i, /Citrus/i, /Musk/i, /Floral/i] } },
          { name: { $in: [/Musk/i, /White/i, /Rose/i, /Vetiver/i] } }
        );
      }

      if (isWedding) {
        orConditions.push(
          { fragranceFamily: { $in: [/Oudh/i, /Amber & Woods/i, /Spicy Oriental/i] } },
          { isBestSeller: true }
        );
      }

      if (orConditions.length > 0) {
        filter.$or = orConditions;
      }

      // Execute query with fallback
      let products = await Product.find(filter)
        .populate('category', 'name slug')
        .sort({ 'ratings.average': -1, isBestSeller: -1 })
        .limit(4)
        .lean();

      let isFallback = false;

      // If strict filter yielded no products, relax filter to show closest matches
      if (products.length === 0) {
        isFallback = true;
        const fallbackFilter = { isActive: { $ne: false } };
        if (maxPrice) fallbackFilter.price = { $lte: maxPrice + 500 };

        products = await Product.find(fallbackFilter)
          .populate('category', 'name slug')
          .sort({ 'ratings.average': -1, isBestSeller: -1 })
          .limit(3)
          .lean();

        // Total inventory fallback if still 0
        if (products.length === 0) {
          products = await Product.find({ isActive: { $ne: false } })
            .populate('category', 'name slug')
            .sort({ isBestSeller: -1, price: 1 })
            .limit(3)
            .lean();
        }
      }

      // Format refined consultant narrative
      let consultantNote = '';

      if (isFallback) {
        consultantNote = `I couldn't find an exact match under your specific search, but based on our master distillations, here are our **highest-rated pure attars** that connoisseurs adore:`;
      } else if (maxPrice && notesKeywords.length > 0) {
        consultantNote = `Exquisite choice! For **${notesKeywords.join(' & ')}** notes under **₹${maxPrice.toLocaleString('en-IN')}**, here are our top handcrafted pure perfume oils matching your palate:`;
      } else if (maxPrice) {
        consultantNote = `Here are the **most revered pure perfume oils** in our vault within your budget of **₹${maxPrice.toLocaleString('en-IN')}**, offering exceptional skin longevity and zero alcohol:`;
      } else if (notesKeywords.length > 0) {
        consultantNote = `Marvelous preference! For **${notesKeywords.join(' & ')}** profiles, here are our master hydro-distillations formulated for royal distinction:`;
      } else if (isOffice) {
        consultantNote = `For daily office and professional wear, subtlety and refined presence are key. These pure attars project an elegant, non-intrusive aura that lasts from morning meetings till evening:`;
      } else if (isWedding) {
        consultantNote = `For celebratory occasions and weddings, you need rich, opulent sillage. These royal Dehn Al Oudh and regal Kashmiri musk formulations create a commanding and unforgettable presence:`;
      } else if (isGift) {
        consultantNote = `Gifting a concentrated pure attar is a centuries-old royal tradition. These universally cherished creations come nestled in luxury flacons that impress every recipient:`;
      } else if (isLongLasting) {
        consultantNote = `Because our attars are 100% undiluted concentrated oils with zero alcohol evaporation, they linger on skin for 24+ hours. Here are our strongest projecting flacons:`;
      } else {
        consultantNote = `Welcome to Attar Depot! Based on your request, here are our distinguished creations curated for your refined taste:`;
      }

      // Suggest contextual quick replies
      const quickReplies = [
        maxPrice ? 'Explore Premium Vault' : '💰 Best under ₹2000',
        notesKeywords.includes('Oudh') ? '🌸 Show Floral Rose' : '🌿 Woody & Oudh',
        '🖤 Long-lasting perfumes',
        '📦 Track my order',
      ];

      return {
        message: consultantNote,
        products,
        quickReplies,
        conversationId,
      };
    } catch (error) {
      console.error('[AI Recommendation Error]', error);
      return {
        message: 'I am experiencing a slight pause connecting to our fragrance vault. Please feel free to ask me again or explore our catalog!',
        products: [],
        quickReplies: ['🔍 Try again', 'Explore all perfumes'],
        conversationId,
      };
    }
  }
}

export default new AiService();
