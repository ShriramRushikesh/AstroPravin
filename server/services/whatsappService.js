// Placeholder for WhatsApp Integration
// In a real implementation, you would use 'twilio' or the Meta Graph API

export const sendWhatsApp = async (mobile, name, pdfLink) => {
    console.log(`[WHATSAPP-MOCK] Sending message to ${mobile}`);
    console.log(`[WHATSAPP-MOCK] Message: Hello ${name}, Your Free Kundli is ready! Download here: ${pdfLink}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, messageId: 'mock-message-id-' + Date.now() };
};


