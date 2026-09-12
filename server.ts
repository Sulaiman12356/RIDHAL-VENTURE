import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Target administrative email for order notifications
const ADMIN_NOTIFICATION_EMAIL = 'alhajabizventure@gmail.com';

// Format currency helper
function formatNaira(amount: number): string {
  return '₦' + (amount || 0).toLocaleString('en-NG');
}

// Generate HTML email template for orders
function buildOrderEmailHtml(order: any): string {
  const itemsHtml = (order.items || []).map((item: any) => {
    const itemTotal = (item.quantity || 1) * (item.product?.price || item.price || 0);
    const options = [
      item.selectedSize ? `Size: ${item.selectedSize}` : null,
      item.selectedColor ? `Color: ${item.selectedColor}` : null,
    ].filter(Boolean).join(' | ');

    return `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; font-family: Arial, sans-serif;">
          <strong>${item.product?.name || item.name || 'Product'}</strong>
          ${options ? `<br><small style="color: #666;">${options}</small>` : ''}
        </td>
        <td style="padding: 10px; text-align: center; font-family: Arial, sans-serif;">${item.quantity || 1}</td>
        <td style="padding: 10px; text-align: right; font-family: Arial, sans-serif;">${formatNaira(item.product?.price || item.price || 0)}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-family: Arial, sans-serif;">${formatNaira(itemTotal)}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Customer Order - Ridhal Ventures</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; color: #1A1A1A;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E8DFC8; border-radius: 12px; overflow: hidden;">
          
          <div style="background-color: #121212; padding: 24px; text-align: center; border-bottom: 3px solid #C59A45;">
            <h1 style="color: #F5E4B5; margin: 0; font-size: 22px; letter-spacing: 2px;">RIDHAL VENTURES</h1>
            <p style="color: #C59A45; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">New Order Notification</p>
          </div>

          <div style="padding: 24px;">
            <div style="background: #F6F2EA; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 14px;"><strong>Order Reference:</strong> <span style="color: #9E7422; font-family: monospace; font-size: 16px;">${order.orderNumber || order.id}</span></p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">Placed at: ${new Date(order.createdAt || Date.now()).toLocaleString()}</p>
            </div>

            <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #111; border-bottom: 2px solid #9E7422; padding-bottom: 6px; margin-top: 0;">Customer Details</h2>
            <table style="width: 100%; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
              <tr>
                <td style="width: 120px; color: #666;"><strong>Full Name:</strong></td>
                <td>${order.customerDetails?.fullName || order.customer?.fullName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="color: #666;"><strong>Phone Number:</strong></td>
                <td><a href="tel:${order.customerDetails?.phone || order.customer?.phone || ''}" style="color: #9E7422; font-weight: bold;">${order.customerDetails?.phone || order.customer?.phone || 'N/A'}</a></td>
              </tr>
              <tr>
                <td style="color: #666;"><strong>Email:</strong></td>
                <td>${order.customerDetails?.email || order.customer?.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="color: #666; vertical-align: top;"><strong>Delivery Address:</strong></td>
                <td>${order.customerDetails?.deliveryAddress || order.customer?.deliveryAddress || 'N/A'}, ${order.customerDetails?.city || order.customer?.city || ''}, ${order.customerDetails?.state || order.customer?.state || ''} State</td>
              </tr>
              ${order.customerDetails?.orderNotes ? `
              <tr>
                <td style="color: #666; vertical-align: top;"><strong>Order Notes:</strong></td>
                <td><em>${order.customerDetails.orderNotes}</em></td>
              </tr>` : ''}
            </table>

            <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #111; border-bottom: 2px solid #9E7422; padding-bottom: 6px;">Ordered Items</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <thead>
                <tr style="background: #FAF8F5; border-bottom: 2px solid #E8DFC8;">
                  <th style="padding: 8px; text-align: left;">Product</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background: #FDFBF7; border: 1px solid #E8DFC8; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="color: #666;">Subtotal:</td>
                  <td style="text-align: right;">${formatNaira(order.subtotal || 0)}</td>
                </tr>
                <tr>
                  <td style="color: #666;">Delivery Fee:</td>
                  <td style="text-align: right;">${formatNaira(order.deliveryFee || 0)}</td>
                </tr>
                <tr style="font-size: 16px; font-weight: bold; border-top: 1px solid #ddd;">
                  <td style="padding-top: 8px; color: #111;">Total Amount:</td>
                  <td style="padding-top: 8px; text-align: right; color: #9E7422;">${formatNaira(order.total || 0)}</td>
                </tr>
                <tr>
                  <td style="color: #666; padding-top: 4px;">Payment Method:</td>
                  <td style="text-align: right; padding-top: 4px; font-weight: 500;">${order.paymentMethod === 'online' ? 'Direct Bank Transfer / Paystack' : 'Cash on Delivery'}</td>
                </tr>
                <tr>
                  <td style="color: #666;">Initial Payment Status:</td>
                  <td style="text-align: right; color: #B45309; font-weight: bold;">${order.paymentStatus || 'Pending'}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 12px; color: #777; text-align: center; margin: 0;">
              This notification was generated automatically by the Ridhal Ventures Store Engine.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Notification service readiness status
app.get('/api/notifications/status', (req, res) => {
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasSendGrid = Boolean(process.env.SENDGRID_API_KEY);
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  const activeProvider = hasResend ? 'resend' : hasSendGrid ? 'sendgrid' : hasSmtp ? 'smtp' : null;

  res.json({
    configured: Boolean(activeProvider),
    provider: activeProvider,
    targetRecipient: ADMIN_NOTIFICATION_EMAIL,
  });
});

// Post order notification
app.post('/api/orders/notify', async (req, res) => {
  try {
    const order = req.body;
    if (!order || (!order.orderNumber && !order.id)) {
      return res.status(400).json({
        success: false,
        sent: false,
        error: 'INVALID_ORDER_PAYLOAD',
        message: 'Order reference number is required'
      });
    }

    const orderRef = order.orderNumber || order.id;
    const subject = `[New Order ${orderRef}] ${order.customerDetails?.fullName || 'Customer'} - ${formatNaira(order.total)}`;
    const htmlBody = buildOrderEmailHtml(order);

    // 1. Check Resend
    if (process.env.RESEND_API_KEY) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@resend.dev';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `Ridhal Ventures <${fromEmail}>`,
          to: [ADMIN_NOTIFICATION_EMAIL],
          subject,
          html: htmlBody
        })
      });

      const data = await response.json();
      if (response.ok) {
        return res.json({
          success: true,
          sent: true,
          provider: 'resend',
          messageId: data.id,
          recipient: ADMIN_NOTIFICATION_EMAIL,
          message: `Real order notification confirmed sent to ${ADMIN_NOTIFICATION_EMAIL}`
        });
      } else {
        return res.status(502).json({
          success: false,
          sent: false,
          provider: 'resend',
          error: 'PROVIDER_REJECTED',
          message: data.message || 'Resend rejected the message dispatch'
        });
      }
    }

    // 2. Check SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'orders@ridhalventures.com';
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: ADMIN_NOTIFICATION_EMAIL }] }],
          from: { email: fromEmail, name: 'Ridhal Ventures' },
          subject,
          content: [{ type: 'text/html', value: htmlBody }]
        })
      });

      if (response.status >= 200 && response.status < 300) {
        return res.json({
          success: true,
          sent: true,
          provider: 'sendgrid',
          recipient: ADMIN_NOTIFICATION_EMAIL,
          message: `Real order notification confirmed sent to ${ADMIN_NOTIFICATION_EMAIL}`
        });
      } else {
        const errText = await response.text();
        return res.status(502).json({
          success: false,
          sent: false,
          provider: 'sendgrid',
          error: 'PROVIDER_REJECTED',
          message: errText || 'SendGrid rejected the message'
        });
      }
    }

    // 3. Check SMTP (Gmail / Custom SMTP)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
      const info = await transporter.sendMail({
        from: `"Ridhal Ventures" <${fromEmail}>`,
        to: ADMIN_NOTIFICATION_EMAIL,
        subject,
        html: htmlBody
      });

      return res.json({
        success: true,
        sent: true,
        provider: 'smtp',
        messageId: info.messageId,
        recipient: ADMIN_NOTIFICATION_EMAIL,
        message: `Real order notification confirmed sent to ${ADMIN_NOTIFICATION_EMAIL}`
      });
    }

    // STRICT REQUIREMENT: "Do not claim that an email was sent unless a real email service confirms the send."
    // No credentials configured: accurately report that no email was sent.
    return res.status(200).json({
      success: false,
      sent: false,
      error: 'NO_EMAIL_SERVICE_CONFIGURED',
      recipient: ADMIN_NOTIFICATION_EMAIL,
      message: `Backend order notification channel is prepared for ${ADMIN_NOTIFICATION_EMAIL}. To activate live email dispatch, configure RESEND_API_KEY, SENDGRID_API_KEY, or SMTP credentials in the server environment.`
    });

  } catch (error: any) {
    console.error('Error in order notification endpoint:', error);
    return res.status(500).json({
      success: false,
      sent: false,
      error: 'SERVER_NOTIFICATION_ERROR',
      message: error.message || 'Internal error handling order notification'
    });
  }
});

// ----------------------------------------------------
// PAYMENT GATEWAY INTEGRATION (PAYSTACK / FLUTTERWAVE)
// ----------------------------------------------------

// Get payment gateway public status
app.get('/api/payment/config', (req, res) => {
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const paystackPublic = process.env.PAYSTACK_PUBLIC_KEY;
  const flutterwaveSecret = process.env.FLUTTERWAVE_SECRET_KEY;

  res.json({
    onlinePaymentEnabled: Boolean(paystackSecret || flutterwaveSecret),
    paystack: {
      available: Boolean(paystackSecret),
      publicKey: paystackPublic || null,
    },
    flutterwave: {
      available: Boolean(flutterwaveSecret),
    },
    bankTransfer: {
      enabled: true,
      bankName: 'Moniepoint Microfinance Bank',
      accountName: 'RIDHAL VENTURES',
      accountNumber: '8223940182',
    },
    cashOnDelivery: {
      enabled: true,
      note: 'Available for selected delivery zones (Ijebu-Ode and designated Ogun State areas)',
    }
  });
});

// Initialize online payment transaction via Paystack
app.post('/api/payment/initialize', async (req, res) => {
  const { email, amount, orderId, callbackUrl } = req.body;

  if (!email || !amount || !orderId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters: email, amount, and orderId are required.',
    });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecret) {
    return res.status(503).json({
      success: false,
      configured: false,
      gateway: 'paystack',
      message: 'Paystack integration credentials are pending configuration in the server environment (PAYSTACK_SECRET_KEY). Customers can still select Direct Bank Transfer or Pay on Delivery to complete orders.',
    });
  }

  try {
    // Paystack takes amount in kobo (1 Naira = 100 kobo)
    const amountInKobo = Math.round(Number(amount) * 100);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        reference: `${orderId}_${Date.now()}`,
        callback_url: callbackUrl || undefined,
        metadata: {
          orderId,
          custom_fields: [
            { display_name: 'Order Reference', variable_name: 'order_id', value: orderId },
          ],
        },
      }),
    });

    const data = await response.json();

    if (response.ok && data.status) {
      return res.json({
        success: true,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.message || 'Unable to initialize transaction with Paystack',
      });
    }
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Payment initialization failed',
    });
  }
});

// Verify online payment with payment gateway
app.get('/api/payment/verify/:reference', async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ success: false, message: 'Transaction reference is required' });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecret) {
    return res.status(503).json({
      success: false,
      verified: false,
      message: 'Cannot verify online payment: PAYSTACK_SECRET_KEY is not configured in server environment.',
    });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.status && data.data.status === 'success') {
      return res.json({
        success: true,
        verified: true,
        status: 'success',
        amount: data.data.amount / 100, // convert kobo back to Naira
        reference: data.data.reference,
        channel: data.data.channel,
        paidAt: data.data.paid_at,
        customer: data.data.customer,
      });
    } else {
      return res.json({
        success: false,
        verified: false,
        status: data.data?.status || 'failed',
        message: data.message || 'Payment verification did not return success',
      });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      message: error.message || 'Error occurred while verifying payment',
    });
  }
});

// Contact message endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  if (!name || (!email && !phone) || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, message, and at least one contact method (email or phone) are required.',
    });
  }

  // Check if SMTP or notification service is available to forward email to owner
  let emailDispatched = false;
  let dispatchNote = '';

  if (process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) {
    try {
      const contactHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAF8F5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 24px; border-radius: 8px; border: 1px solid #DFC377;">
            <h2 style="color: #121212; border-bottom: 2px solid #9E7422; padding-bottom: 8px;">New Customer Inquiry - Ridhal Ventures</h2>
            <p><strong>Customer Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'General Store Inquiry'}</p>
            <div style="margin-top: 16px; padding: 14px; background: #F6F2EA; border-radius: 6px;">
              <strong>Message:</strong>
              <p style="white-space: pre-wrap; margin-top: 8px;">${message}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">Sent via Ridhal Ventures Online Store.</p>
          </div>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `Ridhal Contact <${process.env.RESEND_FROM_EMAIL || 'orders@resend.dev'}>`,
            to: [ADMIN_NOTIFICATION_EMAIL],
            subject: `[Customer Inquiry] ${subject || 'Store Message'} - ${name}`,
            html: contactHtml
          })
        });
        emailDispatched = true;
        dispatchNote = 'Inquiry forwarded to store owner email.';
      }
    } catch (e: any) {
      console.warn('Could not forward contact inquiry by email:', e.message);
    }
  }

  res.json({
    success: true,
    emailDispatched,
    message: emailDispatched 
      ? 'Thank you! Your message has been sent directly to the Ridhal Ventures team.' 
      : 'Thank you! Your message has been received. Our team will get back to you promptly.',
    note: dispatchNote || undefined
  });
});


// ----------------------------------------------------
// VITE OR STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ridhal Ventures server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
