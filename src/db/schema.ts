import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * 1. TENANTS: Multi-tenant practice records
 * White-labeled domains, clinical EMR integrations, and Stripe Connect accounts
 */
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(), // e.g. "Aura MedSpa & Aesthetics"
  slug: varchar('slug', { length: 100 }).notNull().unique(), // e.g. "aura"
  customDomain: varchar('custom_domain', { length: 255 }).notNull().unique(), // e.g. "auramedspa.com"
  branding: jsonb('branding').$type<{
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    themePreset: string;
    logoUrl?: string;
    heroHeadline: string;
    heroSubhead: string;
    bannerText: string;
  }>().notNull(),
  emrProvider: varchar('emr_provider', { length: 50 }).notNull().default('aesthetic_record'), // "aesthetic_record" | "dentrix"
  emrApiKey: text('emr_api_key'),
  stripeAccountId: varchar('stripe_account_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

/**
 * 2. SERVICES: Clinical procedure & treatment catalog
 */
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // injectables, laser_rf, facials, longevity
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull(),
  description: text('description').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  retailPriceCents: integer('retail_price_cents').notNull(), // e.g. 85000 = $850.00
  depositPriceCents: integer('deposit_price_cents').notNull().default(10000), // e.g. 10000 = $100.00
  isFinancingEligible: boolean('is_financing_eligible').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  badge: varchar('badge', { length: 50 }),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * 3. PROVIDERS: Clinical practitioners & medical directors
 */
export const providers = pgTable('providers', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(), // "Dr. Sarah Jenkins, MD"
  title: varchar('title', { length: 255 }).notNull(), // "Medical Director & Facial Plastic Surgeon"
  credentials: text('credentials').notNull(),
  specialty: text('specialty').notNull(),
  bio: text('bio').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  workingHours: jsonb('working_hours').$type<{
    days: string[];
    start: string;
    end: string;
  }>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * 4. PATIENTS: Consumer chart & contact records
 */
export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  medicalHistory: jsonb('medical_history').$type<Record<string, unknown>>().default({}),
  intakeStatus: varchar('intake_status', { length: 50 }).notNull().default('pending'), // "pending" | "completed"
  lastTreatmentDate: timestamp('last_treatment_date'),
  chartNumber: varchar('chart_number', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * 5. APPOINTMENTS: Calendar timetable reservations & EMR sync
 */
export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  patientId: uuid('patient_id').references(() => patients.id, { onDelete: 'cascade' }).notNull(),
  providerId: uuid('provider_id').references(() => providers.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('reserved'), // "reserved", "confirmed", "completed", "no_show"
  depositAmountCents: integer('deposit_amount_cents').notNull().default(10000),
  depositStripeId: varchar('deposit_stripe_id', { length: 255 }),
  emrSyncStatus: varchar('emr_sync_status', { length: 50 }).notNull().default('pending'), // "synced", "pending", "failed"
  emrAppointmentId: varchar('emr_appointment_id', { length: 255 }),
  isMissedCallRecovered: boolean('is_missed_call_recovered').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * 6. ORDERS: Financial deposit transactions & retail sales
 */
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  patientId: uuid('patient_id').references(() => patients.id, { onDelete: 'cascade' }).notNull(),
  appointmentId: uuid('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
  subtotalCents: integer('subtotal_cents').notNull(),
  depositCents: integer('deposit_cents').notNull(),
  gratuityCents: integer('gratuity_cents').notNull().default(0),
  totalDueTodayCents: integer('total_due_today_cents').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // "stripe_card", "apple_pay", "cherry_financing"
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('succeeded'), // "pending", "succeeded", "refunded"
  lineItems: jsonb('line_items').$type<Array<{
    title: string;
    type: string;
    priceCents: number;
    quantity: number;
  }>>().notNull(),
  emrSyncStatus: varchar('emr_sync_status', { length: 50 }).notNull().default('synced'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * 7. INBOUND_LEADS: AI Front Desk & 14s Missed-Call Recovery
 */
export const inboundLeads = pgTable('inbound_leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  patientName: varchar('patient_name', { length: 255 }),
  channel: varchar('channel', { length: 50 }).notNull(), // "web_chat", "sms_missed_call"
  intentScore: integer('intent_score').notNull().default(50), // 0-100
  intentTag: varchar('intent_tag', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('ai_qualifying'), // "ai_qualifying", "converted", "escalated"
  depositSecured: boolean('deposit_secured').notNull().default(false),
  transcript: jsonb('transcript').$type<Array<{
    sender: 'patient' | 'ai' | 'staff';
    text: string;
    timestamp: string;
  }>>().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * 8. RECALL_LOGS: 90-Day & 120-Day Lifecycle Rebooking Engine
 */
export const recallLogs = pgTable('recall_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  patientId: uuid('patient_id').references(() => patients.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }),
  cadenceDays: integer('cadence_days').notNull().default(90),
  dueDate: timestamp('due_date').notNull(),
  sentAt: timestamp('sent_at'),
  status: varchar('status', { length: 50 }).notNull().default('queued'), // "queued", "sent", "booked"
  suggestedSlot: varchar('suggested_slot', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relational Definitions
export const tenantsRelations = relations(tenants, ({ many }) => ({
  services: many(services),
  providers: many(providers),
  patients: many(patients),
  appointments: many(appointments),
  orders: many(orders),
  inboundLeads: many(inboundLeads)
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  tenant: one(tenants, { fields: [appointments.tenantId], references: [tenants.id] }),
  patient: one(patients, { fields: [appointments.patientId], references: [patients.id] }),
  provider: one(providers, { fields: [appointments.providerId], references: [providers.id] }),
  service: one(services, { fields: [appointments.serviceId], references: [services.id] })
}));
