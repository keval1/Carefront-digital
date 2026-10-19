/**
 * TWILIO SMS & VOICE DISPATCH ENGINE
 * Handles 14-second automated missed-call-to-text recovery,
 * post-procedure review dispatches, and 90-day recall triggers.
 */

export interface TwilioInboundCallPayload {
  CallSid: string;
  From: string;
  To: string;
  CallStatus: 'completed' | 'busy' | 'no-answer' | 'failed';
  Timestamp: string;
}

export class TwilioService {
  /**
   * Generates the automated 14-second outbound recovery SMS sent after an after-hours missed call
   */
  static generateMissedCallRecoverySms(practiceName: string, doctorName: string = 'Dr. Jenkins'): string {
    return `📞 [Automated Outbound SMS • Aura Front Desk]: Hi! We missed your call at ${practiceName}. ${doctorName}'s clinical team is currently closed for the evening, but I can help you check pricing, answer procedure questions, or reserve priority scheduling right now. What can we help you with?`;
  }

  /**
   * Dispatches automated post-treatment check-in SMS 2 hours post-checkout
   */
  static generatePostTreatmentCheckinSms(patientName: string, procedureName: string, providerName: string): string {
    return `Hi ${patientName}! How was your ${procedureName} with ${providerName.split(',')[0]} today? Tap a star rating below to share your experience (takes 5 seconds): ⭐⭐⭐⭐⭐`;
  }

  /**
   * Dispatches 90-day / 120-day lifecycle recall SMS
   */
  static generateLifecycleRecallSms(patientName: string, serviceName: string, suggestedSlot: string): string {
    return `Hi ${patientName}, it’s been 90 days since your last ${serviceName}. To preserve your natural muscle balancing, we recommend a maintenance refresh. We have an opening on ${suggestedSlot}. Reply YES to reserve your slot with a $50 deposit!`;
  }

  /**
   * Simulates Twilio webhook delivery with delivery receipt
   */
  static async dispatchSms(to: string, message: string) {
    return {
      success: true,
      sid: `SM_${Math.random().toString(36).substring(2, 12)}`,
      to,
      status: 'delivered',
      timestamp: new Date().toISOString()
    };
  }
}
