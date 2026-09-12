import { create } from 'zustand';

export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Header
    digitalDining: 'Digital Dining',
    tableMenu: 'Table Menu',
    simulateTableScan: 'Simulate Table Scan',
    customerMenu: 'Customer Menu (Table 1)',
    kitchenKds: 'Kitchen (KDS)',
    staffFloor: 'Staff Floor',
    adminPortal: 'Admin Portal',
    qrCodes: 'QR Codes',
    ownerAnalytics: 'Owner Analytics',

    // Table Status Badges
    tableStatus: 'Table Status',
    vacantStatus: 'Vacant',
    occupiedStatus: 'Occupied',
    billRequestedStatus: 'Bill Requested',
    needsCleaningStatus: 'Needs Cleaning',
    capacity: 'Capacity',
    guests: 'Guests',
    
    // Customer Page
    searchPlaceholder: 'Search appetizers, steaks, pasta, drinks...',
    allItems: 'All Items',
    all: 'All',
    veg: 'Veg',
    nonVeg: 'Non-Veg',
    inStock: 'In Stock',
    soldOut: 'Sold Out',
    addDish: '+ Add Dish',
    added: 'Added',
    viewOrderTicket: 'View Order Ticket',
    callWaiter: 'Call Waiter',
    requestBill: 'Request Bill',
    
    // Cart Drawer
    yourTableOrder: 'Your Table Order',
    cartEmpty: 'Your cart is currently empty',
    cartEmptySub: 'Select dishes from the menu to add them here.',
    kitchenNotes: 'Kitchen Notes / Allergies',
    kitchenNotesPlaceholder: 'E.g., allergic to peanuts, serve drinks first...',
    totalOrderAmount: 'Total Order Amount',
    sendToKitchen: 'Send Order to Kitchen',
    sendingToKitchen: 'Sending to Kitchen...',

    // Call Waiter Modal
    callTableWaiter: 'Call Table Waiter',
    selectHelp: 'Select what you need help with',
    waterRefill: 'Water Refill',
    waterDesc: 'Request fresh glass/pitcher of water',
    extraCutlery: 'Extra Cutlery',
    cutleryDesc: 'Forks, spoons, napkins, or plates',
    generalAssistance: 'General Assistance',
    assistanceDesc: 'Ask waiter to visit your table',
    sendAlert: 'Send Alert to Waiter',
    alertingStaff: 'Alerting Floor Staff...',
    waiterNotified: 'Waiter Notified!',
    waiterOnWay: 'A floor server is on their way to your table.',

    // Request Bill Modal
    requestTableBill: 'Request Table Bill',
    selectPayment: 'Select payment method & optional split',
    totalBillAmount: 'Total Bill Amount',
    splitBill: 'Split Bill (Persons)',
    person: 'person',
    paymentOption: 'Payment Option',
    cardPos: 'Card / POS',
    cashOnTable: 'Cash on Table',
    upiQr: 'UPI / QR',
    requestPrintedBill: 'Request Printed Bill',
    requesting: 'Requesting...',
    billRequested: 'Bill Requested!',
    serverBringingBill: 'The server is bringing your printed receipt. Total due:',

    // Status Page
    backToMenu: 'Back to Menu',
    liveStatus: 'Live Status',
    tracker: 'Tracker',
    orderReceived: 'Order Received',
    orderSentDesc: 'Sent to kitchen display',
    chefCooking: 'Chef Cooking',
    chefCookingDesc: 'Preparing dishes',
    platedReady: 'Plated & Ready',
    platedReadyDesc: 'Awaiting waiter pickup',
    servedToTable: 'Served to Table',
    servedDesc: 'Enjoy your meal!',
    orderedItems: 'Ordered Ticket Items',
    totalAmount: 'Total Amount',
    rateExperience: 'Rate Your Dining Experience',
    thankYouFeedback: 'Thank you for your review!',
    feedbackImprove: 'Your feedback helps us continuously improve our service.',
    feedbackPlaceholder: 'Share your thoughts on food quality, speed, or service...',
    submitFeedback: 'Submit Dining Feedback',
  },
  hi: {
    // Header
    digitalDining: 'डिजिटल डाइनिंग',
    tableMenu: 'टेबल मेनू',
    simulateTableScan: 'टेबल स्कैन सिमुलेट करें',
    customerMenu: 'ग्राहक मेनू (टेबल 1)',
    kitchenKds: 'रसोई (KDS)',
    staffFloor: 'स्टाफ फ्लोर',
    adminPortal: 'एडमिन पोर्टल',
    qrCodes: 'क्यूआर कोड',
    ownerAnalytics: 'मालिक एनालिटिक्स',

    // Table Status Badges
    tableStatus: 'टेबल स्थिति',
    vacantStatus: 'खाली (Vacant)',
    occupiedStatus: 'ऑक्यूपाइड (Occupied)',
    billRequestedStatus: 'बिल का अनुरोध (Bill Requested)',
    needsCleaningStatus: 'सफाई की आवश्यकता (Cleaning)',
    capacity: 'क्षमता',
    guests: 'मेहमान',

    // Customer Page
    searchPlaceholder: 'पकवान, ऐपेटाइज़र, पेय खोजें...',
    allItems: 'सभी व्यंजन',
    all: 'सभी',
    veg: 'शाकाहारी',
    nonVeg: 'मांसाहारी',
    inStock: 'उपलब्ध है',
    soldOut: 'समाप्त (Sold Out)',
    addDish: '+ जोड़ें',
    added: 'जोड़ा गया',
    viewOrderTicket: 'ऑर्डर टिकट देखें',
    callWaiter: 'वेटर को बुलाएं',
    requestBill: 'बिल का अनुरोध करें',

    // Cart Drawer
    yourTableOrder: 'आपकी टेबल का ऑर्डर',
    cartEmpty: 'आपकी कार्ट वर्तमान में खाली है',
    cartEmptySub: 'उन्हें यहाँ जोड़ने के लिए मेनू से व्यंजन चुनें।',
    kitchenNotes: 'रसोई नोट्स / एलर्जी संबंधी निर्देश',
    kitchenNotesPlaceholder: 'जैसे, मूंगफली से एलर्जी है, पहले पेय परोसें...',
    totalOrderAmount: 'कुल ऑर्डर राशि',
    sendToKitchen: 'रसोई में ऑर्डर भेजें',
    sendingToKitchen: 'रसोई में भेजा जा रहा है...',

    // Call Waiter Modal
    callTableWaiter: 'टेबल वेटर को बुलाएं',
    selectHelp: 'बताएं कि आपको किस चीज़ में मदद चाहिए',
    waterRefill: 'पानी दोबारा भरें',
    waterDesc: 'ताजा पानी का गिलास/जग मांगें',
    extraCutlery: 'अतिरिक्त चम्मच/प्लेट',
    cutleryDesc: 'कांटे, चम्मच, नैपकिन, या प्लेटें',
    generalAssistance: 'सामान्य सहायता',
    assistanceDesc: 'वेटर को अपनी टेबल पर आने के लिए कहें',
    sendAlert: 'वेटर को अलर्ट भेजें',
    alertingStaff: 'फ्लोर स्टाफ को अलर्ट किया जा रहा है...',
    waiterNotified: 'वेटर को सूचित कर दिया गया!',
    waiterOnWay: 'एक स्टाफ सदस्य आपकी टेबल की ओर आ रहा है।',

    // Request Bill Modal
    requestTableBill: 'टेबल बिल का अनुरोध करें',
    selectPayment: 'भुगतान विधि और विभाजन चुनें',
    totalBillAmount: 'कुल बिल राशि',
    splitBill: 'बिल विभाजित करें (व्यक्ति)',
    person: 'व्यक्ति',
    paymentOption: 'भुगतान विकल्प',
    cardPos: 'कार्ड / POS',
    cashOnTable: 'टेबल पर नकद',
    upiQr: 'यूपीआई / QR',
    requestPrintedBill: 'प्रिंटेड बिल मांगें',
    requesting: 'अनुरोध किया जा रहा है...',
    billRequested: 'बिल का अनुरोध भेजा गया!',
    serverBringingBill: 'वेटर आपकी रसीद ला रहा है। देय कुल राशि:',

    // Status Page
    backToMenu: 'मेनू पर वापस जाएं',
    liveStatus: 'लाइव स्थिति',
    tracker: 'ट्रैकर',
    orderReceived: 'ऑर्डर प्राप्त हुआ',
    orderSentDesc: 'रसोई डिस्प्ले पर भेजा गया',
    chefCooking: 'शेफ खाना बना रहे हैं',
    chefCookingDesc: 'व्यंजन तैयार किए जा रहे हैं',
    platedReady: 'तैयार है',
    platedReadyDesc: 'वेटर द्वारा उठाए जाने की प्रतीक्षा में',
    servedToTable: 'टेबल पर परोसा गया',
    servedDesc: 'अपने भोजन का आनंद लें!',
    orderedItems: 'ऑर्डर किए गए व्यंजन',
    totalAmount: 'कुल राशि',
    rateExperience: 'अपने भोजन के अनुभव को रेट करें',
    thankYouFeedback: 'आपकी समीक्षा के लिए धन्यवाद!',
    feedbackImprove: 'आपकी प्रतिक्रिया हमें हमारी सेवा में सुधार करने में मदद करती है।',
    feedbackPlaceholder: 'भोजन की गुणवत्ता, गति, या सेवा पर अपने विचार साझा करें...',
    submitFeedback: 'फीडबैक जमा करें',
  },
};

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const lang = get().language;
    return translations[lang][key] || translations['en'][key] || key;
  },
}));
