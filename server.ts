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
