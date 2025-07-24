# 💳 Stripe Payment Setup Guide

## 🚀 Step 1: Create Stripe Account

1. **Go to Stripe:** https://stripe.com
2. **Sign up** for a free account
3. **Verify your email**
4. **Complete account setup**

## 🔑 Step 2: Get API Keys

1. **Login to Stripe Dashboard:** https://dashboard.stripe.com
2. **Go to Developers → API Keys**
3. **Copy your keys:**
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## ⚙️ Step 3: Configure Backend

### Update your `.env` file:
```env
MONGO_URL=mongodb://localhost:27017/food-del
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

### Test your Stripe connection:
Add this test route to `backend/routes/orderRoute.js`:

```javascript
// Test Stripe connection
orderRouter.get("/test-stripe", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00 for testing
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ success: true, message: "Stripe connection working!", clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe test failed:", error);
    res.json({ success: false, message: "Stripe connection failed", error: error.message });
  }
});
```

## 🧪 Step 4: Test Stripe Integration

### Test with browser:
Visit: `http://localhost:4000/api/order/test-stripe`

**Expected Response:**
```json
{
  "success": true,
  "message": "Stripe connection working!",
  "clientSecret": "pi_xxxxx_secret_xxxxx"
}
```

## 💰 Step 5: Test Card Numbers

Stripe provides test card numbers:

| Card Number | Description |
|-------------|-------------|
| `4242424242424242` | Visa - Success |
| `4000000000000002` | Visa - Declined |
| `4000000000009995` | Visa - Insufficient funds |
| `5555555555554444` | Mastercard - Success |

**Test Details:**
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

## 🔧 Step 6: Frontend Configuration (Optional)

If you want to customize the checkout, you can add the publishable key to your frontend:

### Create `frontend/src/config/stripe.js`:
```javascript
export const STRIPE_PUBLISHABLE_KEY = "pk_test_your_publishable_key_here";
```

## 🛠️ Troubleshooting

### Common Issues:

1. **401 Unauthorized Error:**
   - Check if STRIPE_SECRET_KEY is correct
   - Make sure it starts with `sk_test_`
   - Verify no extra spaces in .env file

2. **Network Error:**
   - Check internet connection
   - Verify Stripe is not blocked by firewall

3. **Invalid API Key:**
   - Make sure you're using test keys (not live keys)
   - Copy keys directly from Stripe dashboard

### Test Commands:

**Test from terminal:**
```bash
curl -X GET http://localhost:4000/api/order/test-stripe
```

**Test from browser console:**
```javascript
fetch('http://localhost:4000/api/order/test-stripe')
  .then(response => response.json())
  .then(data => console.log('Stripe test:', data));
```

## 📋 Quick Setup Checklist

- [ ] Created Stripe account
- [ ] Got test API keys
- [ ] Added STRIPE_SECRET_KEY to .env
- [ ] Restarted backend server
- [ ] Tested Stripe connection
- [ ] Tried test payment with 4242424242424242

## 🎯 Your Current Setup

Your Stripe integration is already coded in:
- `backend/controllers/orderController.js` (line 4 and placeOrder function)
- Payment flow works with Stripe Checkout
- Success/cancel URLs are configured

**You just need to add your actual Stripe keys!**

## 💡 Pro Tips

1. **Test Mode:** Always test with test keys first
2. **Webhooks:** For production, set up webhooks for payment confirmations
3. **Currency:** Currently set to USD, change if needed
4. **Amount:** Payments are in cents (100 = $1.00)

Once you have your Stripe keys, your payment system will work perfectly! 🚀