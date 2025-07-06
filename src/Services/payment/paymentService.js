// src/Services/payment/paymentService.js
import { baseURI } from "../db_connection";

class PaymentService {
  constructor() {
    this.baseEndpoint = `${baseURI}/payments`;
    this.adminEndpoint = `${baseURI}/admin/payments`;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('firebaseToken');
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  // Process payment (authenticated users only)
  async processPayment(paymentData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      };

      const response = await fetch(`${this.baseEndpoint}/process`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Payment processing failed");
      }

      return {
        success: true,
        message: "Payment processed successfully",
        payment: responseData.payment,
        transactionId: responseData.transactionId
      };
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  }

  // Verify payment (authenticated users only)
  async verifyPayment(transactionId) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ transactionId }),
      };

      const response = await fetch(`${this.baseEndpoint}/verify`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Payment verification failed");
      }

      return {
        success: true,
        verified: responseData.verified,
        payment: responseData.payment
      };
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }

  // Process MTN Mobile Money payment
  async processMTNPayment(paymentData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          ...paymentData,
          provider: 'mtn'
        }),
      };

      const response = await fetch(`${this.baseEndpoint}/mtn`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "MTN payment failed");
      }

      return {
        success: true,
        message: "MTN payment initiated. Please complete on your phone.",
        transactionId: responseData.transactionId,
        reference: responseData.reference
      };
    } catch (error) {
      console.error("Error processing MTN payment:", error);
      throw error;
    }
  }

  // Process Orange Money payment
  async processOrangePayment(paymentData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          ...paymentData,
          provider: 'orange'
        }),
      };

      const response = await fetch(`${this.baseEndpoint}/orange`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Orange payment failed");
      }

      return {
        success: true,
        message: "Orange payment initiated. Please complete on your phone.",
        transactionId: responseData.transactionId,
        reference: responseData.reference
      };
    } catch (error) {
      console.error("Error processing Orange payment:", error);
      throw error;
    }
  }

  // Process Campay payment
  async processCampayPayment(paymentData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          ...paymentData,
          provider: 'campay'
        }),
      };

      const response = await fetch(`${this.baseEndpoint}/campay`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Campay payment failed");
      }

      return {
        success: true,
        message: "Campay payment initiated.",
        transactionId: responseData.transactionId,
        paymentUrl: responseData.paymentUrl
      };
    } catch (error) {
      console.error("Error processing Campay payment:", error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(transactionId) {
    try {
      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/status/${transactionId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get payment status");
      }

      return {
        success: true,
        status: responseData.status,
        payment: responseData.payment
      };
    } catch (error) {
      console.error("Error getting payment status:", error);
      throw error;
    }
  }

  // Get user payment history
  async getPaymentHistory(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseEndpoint}/history?${queryParams}` : `${this.baseEndpoint}/history`;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get payment history");
      }

      return {
        success: true,
        payments: responseData.payments,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting payment history:", error);
      throw error;
    }
  }

  // Process refund (admin only)
  async processRefund(refundData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(refundData),
      };

      const response = await fetch(`${this.baseEndpoint}/refund`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Refund processing failed");
      }

      return {
        success: true,
        message: "Refund processed successfully",
        refund: responseData.refund
      };
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  }

  // Get all payments (admin only)
  async getAllPayments(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.adminEndpoint}?${queryParams}` : this.adminEndpoint;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get payments");
      }

      return {
        success: true,
        payments: responseData.payments,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting all payments:", error);
      throw error;
    }
  }

  // Get payment statistics (admin only)
  async getPaymentStatistics(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.adminEndpoint}/statistics?${queryParams}` : `${this.adminEndpoint}/statistics`;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get payment statistics");
      }

      return {
        success: true,
        statistics: responseData.statistics
      };
    } catch (error) {
      console.error("Error getting payment statistics:", error);
      throw error;
    }
  }

  // Calculate delivery fee
  async calculateDeliveryFee(deliveryData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(deliveryData),
      };

      const response = await fetch(`${this.baseEndpoint}/calculate-delivery-fee`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to calculate delivery fee");
      }

      return {
        success: true,
        deliveryFee: responseData.deliveryFee,
        estimatedTime: responseData.estimatedTime
      };
    } catch (error) {
      console.error("Error calculating delivery fee:", error);
      throw error;
    }
  }

  // Apply discount code
  async applyDiscountCode(discountCode, orderData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ discountCode, orderData }),
      };

      const response = await fetch(`${this.baseEndpoint}/apply-discount`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to apply discount code");
      }

      return {
        success: true,
        discount: responseData.discount,
        finalAmount: responseData.finalAmount
      };
    } catch (error) {
      console.error("Error applying discount code:", error);
      throw error;
    }
  }

  // Get supported payment methods
  async getSupportedPaymentMethods() {
    try {
      const response = await fetch(`${this.baseEndpoint}/methods`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get payment methods");
      }

      return {
        success: true,
        methods: responseData.methods
      };
    } catch (error) {
      console.error("Error getting payment methods:", error);
      throw error;
    }
  }

  // Validate payment data
  validatePaymentData(paymentData) {
    const errors = {};

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    if (!paymentData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^(\+237|237)?[6-9]\d{8}$/.test(paymentData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = "Invalid Cameroon phone number";
    }

    if (!paymentData.provider) {
      errors.provider = "Payment provider is required";
    }

    if (!paymentData.orderId) {
      errors.orderId = "Order ID is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format phone number for Cameroon
  formatPhoneNumber(phoneNumber) {
    // Remove all spaces and special characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if missing
    if (cleaned.length === 9) {
      cleaned = '237' + cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('237')) {
      // Already has country code
    } else if (cleaned.length === 13 && cleaned.startsWith('237')) {
      // Remove extra digit
      cleaned = cleaned.substring(1);
    }
    
    return '+' + cleaned;
  }

  // Get payment provider logo
  getProviderLogo(provider) {
    const logos = {
      mtn: '/images/mtn-logo.png',
      orange: '/images/orange-logo.png',
      campay: '/images/campay-logo.png'
    };
    
    return logos[provider] || '/images/default-payment.png';
  }
}

// Create singleton instance
const PaymentServices = new PaymentService();

export { PaymentServices };
export default PaymentServices;