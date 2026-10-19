/**
 * AI OPERATING SYSTEM & TOOL CALLING ENGINE
 * Powers 24/7 Front Desk, conversational slot bookings,
 * and the In-Page Canvas Copilot.
 */

export interface ToolCallDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const AI_CLINICAL_TOOLS: ToolCallDefinition[] = [
  {
    name: 'getAvailableSlots',
    description: 'Finds available consultation or procedure time slots for a specific provider and date.',
    parameters: {
      type: 'object',
      properties: {
        providerId: { type: 'string', description: 'Provider ID' },
        date: { type: 'string', description: 'Target date YYYY-MM-DD' },
        serviceId: { type: 'string', description: 'Target service ID' }
      },
      required: ['date', 'serviceId']
    }
  },
  {
    name: 'reserveAppointment',
    description: 'Locks an appointment slot and creates a temporary 10-minute reservation hold.',
    parameters: {
      type: 'object',
      properties: {
        slotTime: { type: 'string', description: 'ISO start time' },
        patientName: { type: 'string' },
        patientPhone: { type: 'string' },
        serviceId: { type: 'string' },
        providerId: { type: 'string' }
      },
      required: ['slotTime', 'patientName', 'patientPhone', 'serviceId']
    }
  },
  {
    name: 'sendStripeDepositLink',
    description: 'Generates and texts a secure Stripe Connect checkout link for the required $50 or $100 deposit.',
    parameters: {
      type: 'object',
      properties: {
        reservationId: { type: 'string' },
        depositAmountCents: { type: 'number' },
        patientPhone: { type: 'string' }
      },
      required: ['reservationId', 'depositAmountCents', 'patientPhone']
    }
  }
];

export class AiCopilotService {
  /**
   * Applies natural language mutations from the in-page editor command dock
   */
  static applyCanvasMutation(prompt: string, currentTheme: Record<string, unknown>) {
    const text = prompt.toLowerCase();
    const mutated = { ...currentTheme };

    if (text.includes('fall') || text.includes('autumn') || text.includes('special')) {
      mutated.bannerText = '🍂 Fall Clinical Special: $50 Deposit Locks Priority Scheduling & Complimentary LED Canopy';
    } else if (text.includes('gold') || text.includes('luxe')) {
      mutated.themePreset = 'Luxe Gold';
      mutated.primaryColor = '#1C1917';
      mutated.accentColor = '#C59B27';
    } else if (text.includes('slate') || text.includes('medical') || text.includes('minimal')) {
      mutated.themePreset = 'Clean Medical Slate';
      mutated.primaryColor = '#0F172A';
      mutated.accentColor = '#38BDF8';
      mutated.fontFamily = 'Geometric Sans';
    } else if (text.includes('deposit') && text.includes('75')) {
      mutated.standardDeposit = 7500;
    } else {
      mutated.heroHeadline = 'Feel Better. Move Freely. Live Pain-Free.';
      mutated.heroSubhead = 'Personalized therapeutic medicine and regenerative contouring designed to restore your natural balance.';
    }

    return mutated;
  }
}
