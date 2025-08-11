# 🧪 Complete Checkout Flow Testing Guide

## 🎯 Test Objective
Verify the full end-to-end checkout process works correctly with your Stripe sandbox products.

## 📋 Pre-Test Checklist
- [x] Stripe products loading correctly (✅ Verified: 2 products showing)
- [x] Environment variables configured with sandbox keys
- [x] Site deployed and accessible
- [x] Cart functionality implemented

## 🔄 Test Flow Steps

### Step 1: Product Discovery
1. **Visit Shop Page**: https://same-rr4fx2pogwa-latest.netlify.app/shop
2. **Verify Products Load**:
   - ✅ Natural Skincare Set - NZ$19.99
   - ✅ Organic Tea Blend - NZ$1.00
   - ✅ "Live Stripe API" data source confirmation

### Step 2: Add to Cart Testing
1. **Click "Add to Cart"** on Natural Skincare Set
2. **Verify Cart Updates**:
   - Cart icon shows item count
   - Cart button becomes accessible
3. **Add Second Product** (Organic Tea Blend)
4. **Check Cart State**:
   - Total should be NZ$20.99
   - 2 items in cart

### Step 3: Cart Review
1. **Click Cart Button** in top-right corner
2. **Verify Cart Contents**:
   - Both products listed correctly
   - Quantities adjustable
   - Remove functionality works
   - Total calculated correctly
3. **Click "Proceed to Checkout"**

### Step 4: Checkout Page Testing
1. **Navigate to Checkout**: Should redirect to `/checkout`
2. **Verify Page Elements**:
   - Order summary showing both products
   - Customer form fields
   - Stripe payment form
   - Emergency cache clear button
   - Security indicators (lock icon)

### Step 5: Form Completion
1. **Fill Customer Details**:
   ```
   Name: Test Customer
   Email: test@example.com
   Address: 123 Test Street
   City: Auckland
   Postal Code: 1010
   Country: NZ
   ```

### Step 6: Payment Testing with Test Cards

#### ✅ Successful Payment Test
1. **Use Stripe Test Card**: `4242 4242 4242 4242`
2. **Expiry**: Any future date (e.g., `12/28`)
3. **CVC**: Any 3 digits (e.g., `123`)
4. **Click "Complete Purchase"**
5. **Expected Result**:
   - Payment processes successfully
   - Redirects to `/payment-success`
   - Order confirmation displayed
   - Cart cleared

#### ❌ Failed Payment Tests
1. **Declined Card**: `4000 0000 0000 0002`
   - Should show user-friendly error message
   - Form remains accessible for retry

2. **Insufficient Funds**: `4000 0000 0000 9995`
   - Should display appropriate error message

3. **Expired Card**: `4000 0000 0000 0069`
   - Should handle gracefully with clear messaging

### Step 7: Success Page Verification
1. **Check Payment Success Page**:
   - Success confirmation message
   - Order number displayed
   - Payment intent ID shown
   - Impact message about orphans
   - Links to continue shopping

### Step 8: Stripe Dashboard Verification
1. **Check Stripe Dashboard**: https://dashboard.stripe.com/test/payments
2. **Verify Payment Intent**:
   - Payment shows as successful
   - Correct amount (NZ$20.99)
   - Customer details captured
   - Metadata includes order info

## 🚨 Error Scenarios to Test

### Network Issues
- Test with poor connection
- Verify error handling and retry logic

### Cache Issues
- Use "Emergency Cache Clear" button
- Test after clearing browser cache

### Invalid Form Data
- Submit with missing required fields
- Test email validation
- Test with invalid postal codes

## 🔧 Test Cards for Different Scenarios

| Card Number | Description | Expected Result |
|-------------|-------------|-----------------|
| 4242 4242 4242 4242 | Valid card | ✅ Success |
| 4000 0000 0000 0002 | Declined card | ❌ Generic decline |
| 4000 0000 0000 9995 | Insufficient funds | ❌ Insufficient funds error |
| 4000 0000 0000 0069 | Expired card | ❌ Expired card error |
| 4000 0000 0000 0119 | Processing error | ❌ Processing error |

## 📊 Success Criteria

### ✅ Must Pass
- [ ] Products load from Stripe correctly
- [ ] Cart functionality works (add/remove/update)
- [ ] Checkout form validation works
- [ ] Successful payments complete end-to-end
- [ ] Payment success page displays correctly
- [ ] Failed payments show appropriate errors
- [ ] Cart clears after successful payment
- [ ] Payments appear in Stripe dashboard

### 🎯 Bonus Points
- [ ] Error messages are user-friendly
- [ ] Loading states are smooth
- [ ] Mobile experience works well
- [ ] Performance is acceptable
- [ ] Security indicators are visible

## 🐛 Known Issues to Monitor
- Cache-related payment intent conflicts
- Stripe key account mismatches
- Browser compatibility issues
- Mobile payment form layout

## 📱 Mobile Testing
Test the same flow on mobile devices:
- iPhone Safari
- Android Chrome
- Responsive design verification
- Touch interactions work smoothly

---

**Test Status**: Ready for execution
**Last Updated**: Current deployment (Version 62)
**Tester**: Follow this guide step-by-step and report any issues found
