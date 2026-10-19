import * as schema from './schema';
import { Service, Provider, Appointment, Order, InboundLead, RecallLog, ReviewItem } from '../types';

/**
 * PRODUCTION SEED DATA: AURA MEDSPA & AESTHETICS (BEVERLY HILLS, CA)
 * Fully hydrated clinical catalog, staff credentials, and verified patient records.
 */

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    tenantId: 'tenant-aura-1',
    category: 'laser_rf',
    name: 'Morpheus8 RF Dermal Lift',
    slug: 'morpheus8-rf',
    description: 'Fractional radiofrequency thermal remodeling that penetrates up to 4mm subdermally to trigger massive neocollagenesis, jawline contouring, and pore refinement.',
    durationMinutes: 60,
    retailPriceCents: 85000,
    depositPriceCents: 10000,
    isFinancingEligible: true,
    isActive: true,
    badge: 'Most Popular',
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f023075b9f9?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'srv-2',
    tenantId: 'tenant-aura-1',
    category: 'injectables',
    name: 'Lip Architecture & Micro-Contour',
    slug: 'lip-architecture',
    description: 'Structural hyaluronic acid mapping with micro-cannula technique for hydrated proportion, cupid’s bow definition, and natural facial harmony.',
    durationMinutes: 45,
    retailPriceCents: 68000,
    depositPriceCents: 7500,
    isFinancingEligible: true,
    isActive: true,
    badge: 'Signature Lift',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'srv-3',
    tenantId: 'tenant-aura-1',
    category: 'facials',
    name: 'Medical Hydrafacial MD Elite',
    slug: 'medical-hydrafacial',
    description: 'Deep vortex extraction, botanical peel exfoliation, hyaluronic peptide flood, and collagen LED canopy for immediate red-carpet glass skin radiance.',
    durationMinutes: 60,
    retailPriceCents: 32500,
    depositPriceCents: 5000,
    isFinancingEligible: false,
    isActive: true,
    badge: 'Instant Radiance',
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'srv-4',
    tenantId: 'tenant-aura-1',
    category: 'injectables',
    name: 'Botox Cosmetic (40-Unit Bundle)',
    slug: 'botox-cosmetic',
    description: 'Targeted neuromodulator micro-dosing for glabella, forehead lines, and crow’s feet that stops dynamic wrinkles while preserving expressive mobility.',
    durationMinutes: 30,
    retailPriceCents: 48000,
    depositPriceCents: 5000,
    isFinancingEligible: false,
    isActive: true,
    badge: 'High Loyalty',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80'
  }
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prv-1',
    tenantId: 'tenant-aura-1',
    name: 'Dr. Sarah Jenkins, MD',
    title: 'Medical Director & Facial Plastic Surgeon',
    credentials: 'Board-Certified • Double Fellowship Trained • 14+ Yrs',
    specialty: 'Deep-Plane Facial Architecture, Morpheus8 Body/Face, Sculptra Volumizing',
    bio: 'Pioneered micro-anatomical facial balancing in Beverly Hills. Specializes in structural preservation and high-precision restorative rejuvenation.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    workingHours: {
      days: ['Mon', 'Tue', 'Thu', 'Fri'],
      start: '09:00',
      end: '18:00'
    }
  },
  {
    id: 'prv-2',
    tenantId: 'tenant-aura-1',
    name: 'Elena Rostova, PA-C',
    title: 'Senior Master Aesthetic Injector',
    credentials: 'Top 1% Allergan Master Injector • Galderma Faculty',
    specialty: 'Micro-Droplet Neuromodulators, Cannula Lip Contouring, Sciton BBL Hero',
    bio: 'Recognized nationally for natural, undetectable lip architecture and full-face tox harmonization with zero heavy downtime.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813511-c9889417ef1b?auto=format&fit=crop&w=300&q=80',
    workingHours: {
      days: ['Tue', 'Wed', 'Fri', 'Sat'],
      start: '09:30',
      end: '18:30'
    }
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Week 1 (Oct 1 - Oct 2)
  {
    id: 'apt-1',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-1',
    patientName: 'Camilla Vance',
    patientPhone: '(310) 844-1290',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-1',
    serviceName: 'Morpheus8 RF Dermal Lift',
    startTime: '2026-10-01T09:30:00Z',
    endTime: '2026-10-01T10:30:00Z',
    status: 'completed',
    depositAmountCents: 10000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C1',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9941',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-2',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-2',
    patientName: 'Marcus Sterling',
    patientPhone: '(310) 554-9921',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-4',
    serviceName: 'Botox Cosmetic (40-Unit Bundle)',
    startTime: '2026-10-02T11:00:00Z',
    endTime: '2026-10-02T11:30:00Z',
    status: 'completed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C2',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9942',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-3',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-3',
    patientName: 'Seraphina Laurent',
    patientPhone: '(310) 902-8314',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-2',
    serviceName: 'Clear + Brilliant Perméa Laser',
    startTime: '2026-10-02T14:00:00Z',
    endTime: '2026-10-02T14:45:00Z',
    status: 'completed',
    depositAmountCents: 7500,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C3',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9943',
    isMissedCallRecovered: false
  },

  // Week 2 (Oct 5 - Oct 9)
  {
    id: 'apt-4',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-4',
    patientName: 'Harrison Ford-Hayes',
    patientPhone: '(310) 412-7788',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-3',
    serviceName: 'Sculptra Aesthetic Collagen Matrix',
    startTime: '2026-10-05T13:30:00Z',
    endTime: '2026-10-05T14:30:00Z',
    status: 'completed',
    depositAmountCents: 15000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C4',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9944',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-5',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-5',
    patientName: 'Genevieve DuMont',
    patientPhone: '(310) 773-4519',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-5',
    serviceName: 'HydraFacial Deluxe with Booster',
    startTime: '2026-10-06T09:00:00Z',
    endTime: '2026-10-06T09:45:00Z',
    status: 'completed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C5',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9945',
    isMissedCallRecovered: true
  },
  {
    id: 'apt-6',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-6',
    patientName: 'Julian Thorne',
    patientPhone: '(310) 650-1123',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-1',
    serviceName: 'Morpheus8 RF Dermal Lift',
    startTime: '2026-10-07T14:00:00Z',
    endTime: '2026-10-07T15:00:00Z',
    status: 'completed',
    depositAmountCents: 10000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C6',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9946',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-7',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-7',
    patientName: 'Victoria Sterling',
    patientPhone: '(310) 881-9022',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-4',
    serviceName: 'Botox Cosmetic (40-Unit Bundle)',
    startTime: '2026-10-08T10:30:00Z',
    endTime: '2026-10-08T11:00:00Z',
    status: 'completed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C7',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9947',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-8',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-8',
    patientName: 'Chloe Davenport',
    patientPhone: '(310) 334-8891',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-6',
    serviceName: 'BBL HERO Photofacial & Pigment',
    startTime: '2026-10-09T11:30:00Z',
    endTime: '2026-10-09T12:15:00Z',
    status: 'completed',
    depositAmountCents: 7500,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C8',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9948',
    isMissedCallRecovered: false
  },

  // Week 3 (Oct 12 - Oct 16)
  {
    id: 'apt-9',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-9',
    patientName: 'Alexander Cross',
    patientPhone: '(310) 441-2099',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-1',
    serviceName: 'Morpheus8 RF Dermal Lift',
    startTime: '2026-10-12T15:00:00Z',
    endTime: '2026-10-12T16:00:00Z',
    status: 'confirmed',
    depositAmountCents: 10000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C9',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9949',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-10',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-10',
    patientName: 'Dominique Silva',
    patientPhone: '(310) 998-3412',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-2',
    serviceName: 'Clear + Brilliant Perméa Laser',
    startTime: '2026-10-13T10:00:00Z',
    endTime: '2026-10-13T10:45:00Z',
    status: 'confirmed',
    depositAmountCents: 7500,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C10',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9950',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-11',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-11',
    patientName: 'Natasha Roman',
    patientPhone: '(310) 720-4491',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-3',
    serviceName: 'Sculptra Aesthetic Collagen Matrix',
    startTime: '2026-10-14T09:30:00Z',
    endTime: '2026-10-14T10:30:00Z',
    status: 'confirmed',
    depositAmountCents: 15000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C11',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9951',
    isMissedCallRecovered: false
  },

  // PRESENT DAY APPOINTMENTS: OCTOBER 15 (THURSDAY) - HIGHLIGHTED!
  {
    id: 'apt-today-1',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-td-1',
    patientName: 'Camilla Vance',
    patientPhone: '(310) 844-1290',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-1',
    serviceName: 'Morpheus8 RF Dermal Lift',
    startTime: '2026-10-15T09:30:00Z',
    endTime: '2026-10-15T10:30:00Z',
    status: 'confirmed',
    depositAmountCents: 10000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C15A',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9941',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-today-2',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-td-2',
    patientName: 'Marcus Sterling',
    patientPhone: '(310) 554-9921',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-4',
    serviceName: 'Botox Cosmetic (40-Unit Bundle)',
    startTime: '2026-10-15T11:00:00Z',
    endTime: '2026-10-15T11:30:00Z',
    status: 'confirmed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C15B',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9942',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-today-3',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-td-3',
    patientName: 'Helena Bergson',
    patientPhone: '(310) 412-8822',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-5',
    serviceName: 'HydraFacial Deluxe with Booster',
    startTime: '2026-10-15T14:30:00Z',
    endTime: '2026-10-15T15:15:00Z',
    status: 'confirmed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C15C',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9943',
    isMissedCallRecovered: true
  },

  {
    id: 'apt-12',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-12',
    patientName: 'Liam Kensington',
    patientPhone: '(310) 801-6677',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-4',
    serviceName: 'Botox Cosmetic (40-Unit Bundle)',
    startTime: '2026-10-16T13:30:00Z',
    endTime: '2026-10-16T14:00:00Z',
    status: 'confirmed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C12',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9952',
    isMissedCallRecovered: false
  },

  // Week 4 (Oct 19 - Oct 23)
  {
    id: 'apt-13',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-13',
    patientName: 'Aria Montgomery',
    patientPhone: '(310) 542-8800',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-5',
    serviceName: 'HydraFacial Deluxe with Booster',
    startTime: '2026-10-19T10:00:00Z',
    endTime: '2026-10-19T10:45:00Z',
    status: 'confirmed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C13',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9953',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-14',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-14',
    patientName: 'Sebastian Cole',
    patientPhone: '(310) 619-3321',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-6',
    serviceName: 'BBL HERO Photofacial & Pigment',
    startTime: '2026-10-20T11:30:00Z',
    endTime: '2026-10-20T12:15:00Z',
    status: 'confirmed',
    depositAmountCents: 7500,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C14',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9954',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-15',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-15',
    patientName: 'Evelyn St. Claire',
    patientPhone: '(310) 904-5511',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-1',
    serviceName: 'Morpheus8 RF Dermal Lift',
    startTime: '2026-10-21T13:30:00Z',
    endTime: '2026-10-21T14:30:00Z',
    status: 'confirmed',
    depositAmountCents: 10000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C15',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9955',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-16',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-16',
    patientName: 'Devon Gallagher',
    patientPhone: '(310) 220-4499',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-4',
    serviceName: 'Botox Cosmetic (40-Unit Bundle)',
    startTime: '2026-10-22T15:00:00Z',
    endTime: '2026-10-22T15:30:00Z',
    status: 'confirmed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C16',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9956',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-17',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-17',
    patientName: 'Isabella Fontaine',
    patientPhone: '(310) 334-1928',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-2',
    serviceName: 'Clear + Brilliant Perméa Laser',
    startTime: '2026-10-23T10:00:00Z',
    endTime: '2026-10-23T10:45:00Z',
    status: 'confirmed',
    depositAmountCents: 7500,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C17',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9957',
    isMissedCallRecovered: false
  },

  // Week 5 (Oct 26 - Oct 30)
  {
    id: 'apt-18',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-18',
    patientName: 'Noah Vance',
    patientPhone: '(310) 789-1122',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-1',
    serviceName: 'Morpheus8 RF Dermal Lift',
    startTime: '2026-10-26T14:00:00Z',
    endTime: '2026-10-26T15:00:00Z',
    status: 'confirmed',
    depositAmountCents: 10000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C18',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9958',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-19',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-19',
    patientName: 'Penelope Cruz-Ward',
    patientPhone: '(310) 412-9901',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-3',
    serviceName: 'Sculptra Aesthetic Collagen Matrix',
    startTime: '2026-10-27T09:30:00Z',
    endTime: '2026-10-27T10:30:00Z',
    status: 'confirmed',
    depositAmountCents: 15000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C19',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9959',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-20',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-20',
    patientName: 'Lucas Vance-Moretti',
    patientPhone: '(310) 887-1234',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-5',
    serviceName: 'HydraFacial Deluxe with Booster',
    startTime: '2026-10-28T11:00:00Z',
    endTime: '2026-10-28T11:45:00Z',
    status: 'confirmed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C20',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9960',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-21',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-21',
    patientName: 'Clara Delacroix',
    patientPhone: '(310) 654-8833',
    providerId: 'prv-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    serviceId: 'srv-4',
    serviceName: 'Botox Cosmetic (40-Unit Bundle)',
    startTime: '2026-10-29T13:30:00Z',
    endTime: '2026-10-29T14:00:00Z',
    status: 'confirmed',
    depositAmountCents: 5000,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C21',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9961',
    isMissedCallRecovered: false
  },
  {
    id: 'apt-22',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-22',
    patientName: 'Gabriel Sinclair',
    patientPhone: '(310) 991-4477',
    providerId: 'prv-2',
    providerName: 'Elena Rostova, PA-C',
    serviceId: 'srv-6',
    serviceName: 'BBL HERO Photofacial & Pigment',
    startTime: '2026-10-30T10:00:00Z',
    endTime: '2026-10-30T10:45:00Z',
    status: 'confirmed',
    depositAmountCents: 7500,
    depositStripeId: 'pi_3MtwxX2eZvKYlo2C22',
    emrSyncStatus: 'synced',
    emrAppointmentId: 'AR-9962',
    isMissedCallRecovered: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-1',
    patientName: 'Camilla Vance',
    appointmentId: 'apt-1',
    subtotalCents: 85000,
    depositCents: 10000,
    gratuityCents: 2000,
    totalDueTodayCents: 12000,
    paymentMethod: 'stripe_card',
    stripePaymentIntentId: 'pi_3MtwxX2eZvKYlo2C1',
    status: 'succeeded',
    lineItems: [
      { title: 'Morpheus8 RF Booking Deposit', type: 'service_deposit', priceCents: 10000, quantity: 1 }
    ],
    emrSyncStatus: 'synced',
    createdAt: 'Oct 14, 2026 • 2:15 PM'
  },
  {
    id: 'ord-102',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-2',
    patientName: 'Marcus Sterling',
    appointmentId: 'apt-2',
    subtotalCents: 48000,
    depositCents: 5000,
    gratuityCents: 1000,
    totalDueTodayCents: 6000,
    paymentMethod: 'apple_pay',
    stripePaymentIntentId: 'pi_3MtwxX2eZvKYlo2C2',
    status: 'succeeded',
    lineItems: [
      { title: 'Botox Cosmetic Booking Deposit', type: 'service_deposit', priceCents: 5000, quantity: 1 }
    ],
    emrSyncStatus: 'synced',
    createdAt: 'Oct 14, 2026 • 4:30 PM'
  }
];

export const INITIAL_INBOUND_LEADS: InboundLead[] = [
  {
    id: 'lead-1',
    tenantId: 'tenant-aura-1',
    phone: '(310) 554-9218',
    patientName: 'Hannah Montgomery',
    channel: 'web_chat',
    intentScore: 94,
    intentTag: 'High Value ($1,000+)',
    status: 'converted',
    depositSecured: true,
    transcript: [
      { sender: 'patient', text: 'Hi! Looking into Morpheus8 3-session series. What is the downtime between visits?', timestamp: '2:14 PM' },
      { sender: 'ai', text: 'Hello Hannah! Treatments are spaced 4–6 weeks apart. A $100 deposit locks priority scheduling.', timestamp: '2:15 PM' },
      { sender: 'patient', text: 'Perfect, booking now with Dr. Jenkins!', timestamp: '2:16 PM' }
    ],
    createdAt: '12 mins ago'
  }
];

export const INITIAL_RECALL_LOGS: RecallLog[] = [
  {
    id: 'rcl-1',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-101',
    patientName: 'Victoria Sloane',
    patientPhone: '(310) 902-1144',
    serviceName: 'Botox Cosmetic (40-Unit Refresh)',
    cadenceDays: 90,
    dueDate: '2026-10-18T00:00:00Z',
    status: 'queued',
    suggestedSlot: 'Thursday at 2:00 PM with Elena Rostova'
  },
  {
    id: 'rcl-2',
    tenantId: 'tenant-aura-1',
    patientId: 'pat-102',
    patientName: 'Julian Sterling',
    patientPhone: '(310) 844-3329',
    serviceName: 'Medical Hydrafacial MD Elite',
    cadenceDays: 30,
    dueDate: '2026-10-16T00:00:00Z',
    status: 'queued',
    suggestedSlot: 'Friday at 11:30 AM with Mia Sterling'
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Sarah Johnson',
    role: 'Marketing Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    procedure: 'Morpheus8 RF Dermal Lift',
    provider: 'Dr. Sarah Jenkins, MD',
    comment: 'Carefront and Aura completely transformed my approach to wellness. The therapists are incredibly skilled, and I finally feel relief from my chronic neck pain and tension. The online deposit booking was seamless.',
    date: 'Yesterday',
    status: 'Posted to Google',
    aiSentimentTag: '5★ High Intent Advocate',
    emrVerified: true,
    aiDraftResponse: 'Thank you Sarah! Dr. Jenkins takes immense pride in restorative anatomy and patient comfort.'
  },
  {
    id: 'rev-2',
    author: 'Michael Chen',
    role: 'Fitness Coach',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    procedure: 'Sports Recovery & Dry Needling',
    provider: 'Elena Rostova, PA-C',
    comment: 'As an athlete, I’ve tried many clinics, but Aura stands out for their personalized anatomical approach. My mobility has noticeably improved.',
    date: '3 days ago',
    status: 'Posted to Google',
    aiSentimentTag: '5★ High Intent Advocate',
    emrVerified: true,
    aiDraftResponse: 'Thank you Michael! Elena and the clinical team are thrilled to keep you performing at your peak.'
  },
  {
    id: 'rev-3',
    author: 'Jessica Davis',
    role: 'Creative Director',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    procedure: 'Medical Hydrafacial MD Elite',
    provider: 'Mia Sterling, LE',
    comment: 'My VIP membership is worth every penny. Convenient booking with professional therapists, and a calming red-carpet glow every single month.',
    date: '1 week ago',
    status: 'Posted to Google',
    aiSentimentTag: '5★ High Intent Advocate',
    emrVerified: true,
    aiDraftResponse: 'Thank you Jessica! We look forward to preparing your skin for your upcoming shoot next month.'
  },
  {
    id: 'rev-4',
    author: 'Robert Williams',
    role: 'Managing Partner',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    procedure: 'Deep Tissue & Subdermal Release',
    provider: 'Dr. Sarah Jenkins, MD',
    comment: 'Outstanding service from start to finish. The online booking process was effortless, and the therapists truly understand what your body needs.',
    date: '2 weeks ago',
    status: 'Posted to Google',
    aiSentimentTag: '5★ High Intent Advocate',
    emrVerified: true,
    aiDraftResponse: 'Thank you Robert! Delivering hospital-grade precision with luxury comfort is our standard.'
  }
];

// ==========================================
// SEED DATA: MARKETING ADS & ARTICLES
// ==========================================
export const INITIAL_AD_CREATIVES: import('../types').AdCreative[] = [
  {
    id: 'ad-1',
    procedureName: 'Morpheus8 RF Dermal Lift',
    headlineBadge: 'Beverly Hills Signature',
    aspectRatio: '4:5 Feed',
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f023075b9f9?auto=format&fit=crop&w=800&q=80',
    shortHook: 'Sculpt your jawline and reverse laxity without surgical downtime.',
    educationalStory: 'Standard microneedling only grazes the epidermis. Morpheus8 penetrates up to 4mm subdermally, deploying thermal radiofrequency energy directly into the fibrous septa to melt submental fat and contract collagen.',
    directOffer: 'Claim $150 Off your first Morpheus8 protocol + $0 down Cherry Financing from $71/mo. Only 6 consult slots open this week with Dr. Jenkins.',
    targetAudienceTags: ['Women 32–58', 'Radius 15mi Beverly Hills', 'Luxury Aesthetic Interest', 'Household Income $150k+'],
    suggestedBudgetDaily: 65,
    projectedRoas: '4.8x'
  },
  {
    id: 'ad-2',
    procedureName: 'Lip Architecture & Micro-Contour',
    headlineBadge: 'Natural Anatomy Mapping',
    aspectRatio: '1:1 Square',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    shortHook: 'No duck lips. Just anatomical proportion, crisp cupid borders, and hydration.',
    educationalStory: 'Using blunt micro-cannula technique rather than sharp hypodermic needles, Dr. Jenkins restores lip volume with minimal bruising, zero vascular compromise, and effortless movement.',
    directOffer: 'Reserve with a $75 refundable deposit. Includes complimentary clinical hyaluronic lip sealant.',
    targetAudienceTags: ['Women 24–45', 'Radius 12mi', 'Medical Aesthetics Enthusiasts', 'First-Time Injectable Inquirers'],
    suggestedBudgetDaily: 45,
    projectedRoas: '5.2x'
  },
  {
    id: 'ad-3',
    procedureName: 'Full-Face Tox Balancing (Botox & Dysport)',
    headlineBadge: 'Express Refresh',
    aspectRatio: '9:16 Story',
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80',
    shortHook: 'Smooth deep forehead creases and crow’s feet while keeping full natural expression.',
    educationalStory: 'Full-face neuromodulation balances the frontalis, glabella, and depressor muscles for an open, refreshed gaze rather than a frozen mask. Administered strictly by board-certified physicians.',
    directOffer: '$520 for 40 units (Save $120) with instant online time-slot lock and zero waiting room time.',
    targetAudienceTags: ['All Genders 28–60', 'Radius 20mi', 'Busy Executives', '90-Day Refresh Window'],
    suggestedBudgetDaily: 50,
    projectedRoas: '6.1x'
  }
];

export const INITIAL_SEO_ARTICLES: import('../types').SeoArticle[] = [
  {
    id: 'art-1',
    procedureName: 'Morpheus8 RF Dermal Lift',
    title: 'Complete Clinical Guide to Morpheus8 Downtime, Recovery & Results in Beverly Hills',
    slug: 'complete-guide-morpheus8-downtime-results',
    metaDescription: 'Learn everything about Morpheus8 RF microneedling: expected swelling timeline, post-care protocols, collagen remodeling science, and costs in Beverly Hills by Dr. Sarah Jenkins, MD.',
    readTime: '6 min read',
    targetKeywords: ['Morpheus8 Beverly Hills', 'Morpheus8 downtime timeline', 'RF microneedling recovery', 'subdermal adipose remodeling'],
    isPublishedToBlog: true,
    publishedDate: 'October 8, 2026',
    schemaJsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "Complete Clinical Guide to Morpheus8 Downtime & Results",
      "headline": "Morpheus8 RF Microneedling: Clinical Protocol and Patient Timeline",
      "author": {
        "@type": "Physician",
        "name": "Dr. Sarah Jenkins, MD",
        "medicalSpecialty": "Dermatology & Aesthetic Surgery"
      },
      "publisher": {
        "@type": "MedicalBusiness",
        "name": "Aura MedSpa & Aesthetics Beverly Hills"
      }
    }, null, 2),
    contentMarkdown: `### What Makes Morpheus8 the Gold Standard for Subdermal Tightening?
Morpheus8 combines minimally invasive micro-pins with bipolar radiofrequency energy. Unlike surface lasers that heat only the epidermis, Morpheus8 targets the fibroseptal network up to 4mm deep.

#### Timeline of Recovery
- **Hours 1–24:** Erythema (mild redness) similar to a moderate sunburn. Swelling is minimal.
- **Days 2–3:** Grid marks may be visible upon close inspection; mineral makeup may be applied after 48 hours.
- **Days 7–14:** Initial contraction visible; long-term neocollagenesis continues for up to 6 months.`
  },
  {
    id: 'art-2',
    procedureName: 'Botox Cosmetic',
    title: 'Botox vs. Dermal Fillers: Which Treatment is Right for Your Facial Anatomy?',
    slug: 'botox-vs-dermal-fillers-facial-anatomy-guide',
    metaDescription: 'An anatomical breakdown by board-certified physicians comparing dynamic wrinkle relaxation with structural volumization.',
    readTime: '5 min read',
    targetKeywords: ['Botox vs filler', 'dynamic wrinkles vs static folds', 'Beverly Hills cosmetic injectables'],
    isPublishedToBlog: false,
    publishedDate: 'Drafted Today',
    schemaJsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "Botox vs. Dermal Fillers Anatomical Guide",
      "author": { "@type": "Physician", "name": "Dr. Sarah Jenkins, MD" }
    }, null, 2),
    contentMarkdown: `### Understanding Dynamic vs. Static Rhytids
Neuromodulators (Botox, Dysport, Daxxify) work on the neuromuscular junction, interrupting acetylcholine signaling to prevent repetitive muscle contractions that etch dynamic lines. Hyaluronic acid dermal fillers (Juvederm, Restylane, RHA) provide structural matrix support where fat pads and bone density have resorbed.`
  }
];

export const INITIAL_BROADCAST_CAMPAIGNS: import('../types').BroadcastCampaign[] = [
  {
    id: 'camp-1',
    name: 'Fall Rejuvenation Refresh 2026',
    channel: 'sms',
    segmentName: 'Dormant Patients (6+ Months Since Last Visit)',
    audienceCount: 142,
    promoOffer: '$50 Off Any Fall Treatment',
    promoCode: 'FALLGLOW',
    messageContent: 'Aura MedSpa: Hi {first_name}, enjoy $50 off your next treatment with Dr. Jenkins this week only. Claim your credit and lock your slot: {booking_link} • Reply STOP to opt out',
    deliverabilityRate: 99.4,
    projectedRevenue: 8200,
    status: 'sent',
    sentAt: 'Yesterday at 11:30 AM',
    openedCount: 138,
    convertedCount: 19
  },
  {
    id: 'camp-2',
    name: 'Neurotoxin 90-Day VIP Refill Alert',
    channel: 'sms',
    segmentName: 'Neurotoxin Due for Refresh (90–120 Days)',
    audienceCount: 38,
    promoOffer: '$35 Off Botox Refill',
    promoCode: 'REFRESH35',
    messageContent: 'Aura VIP: Hi {first_name}, your 90-day brow maintenance window is here. Prevent lines from returning and keep your glow: {booking_link} • Reply STOP to cancel',
    deliverabilityRate: 99.8,
    projectedRevenue: 4940,
    status: 'sent',
    sentAt: '3 days ago',
    openedCount: 37,
    convertedCount: 14
  }
];

// ==========================================
// SEED DATA: ABANDONED CHECKOUT RECOVERY
// ==========================================
export const INITIAL_ABANDONED_CHECKOUTS: import('../types').AbandonedCheckout[] = [
  {
    id: 'ab-1',
    patientName: 'Elena Rostova',
    phone: '(310) 555-0192',
    email: 'elena.rostova@gmail.com',
    treatmentName: 'Morpheus8 RF Dermal Lift',
    cartTotalCents: 85000,
    depositAmountCents: 10000,
    dropoffStage: 'deposit_auth',
    dropoffStageLabel: 'Stripe Card Authorization',
    abandonedAt: '24 mins ago',
    timeAgo: '24m ago',
    status: 'pending_auto_sms',
    recoveryDiscountOffer: '$50 Off Deposit',
    suggestedSmsText: 'Aura Concierge: Hi Elena, we noticed you started booking Morpheus8 RF with Dr. Jenkins. We held your preferred Thursday 2:30 PM slot for 30 minutes. Complete with $50 off your deposit here: https://auramedspa.com/book/morpheus8?c=SAVE50'
  },
  {
    id: 'ab-2',
    patientName: 'Chloe Vance',
    phone: '(424) 555-0189',
    email: 'chloe.vance@beverlyhillsart.org',
    treatmentName: 'Lip Architecture & Micro-Contour',
    cartTotalCents: 68000,
    depositAmountCents: 7500,
    dropoffStage: 'financing_prequal',
    dropoffStageLabel: 'Cherry 0% Financing Application',
    abandonedAt: '52 mins ago',
    timeAgo: '52m ago',
    status: 'sms_sent',
    recoveryDiscountOffer: '$0 Down Soft Approval Check',
    suggestedSmsText: 'Hi Chloe, your Cherry 0% pre-qualification is ready with 0 impact to credit score ($57/mo). Pick your injector: https://auramedspa.com/book/lips?flow=cherry'
  },
  {
    id: 'ab-3',
    patientName: 'Marcus Chen',
    phone: '(310) 555-0144',
    email: 'marcus.c@techventures.co',
    treatmentName: 'Botox Cosmetic (40-Unit Bundle)',
    cartTotalCents: 52000,
    depositAmountCents: 5000,
    dropoffStage: 'datetime_select',
    dropoffStageLabel: 'Calendar Slot Picker',
    abandonedAt: '2 hours ago',
    timeAgo: '2h ago',
    status: 'recovered',
    recoveryDiscountOffer: 'Complimentary B12 Booster',
    suggestedSmsText: 'Marcus, Dr. Jenkins opened an express 8:30 AM Friday window for Botox. Reserved for you: https://auramedspa.com/book/tox'
  },
  {
    id: 'ab-4',
    patientName: 'David Kim',
    phone: '(213) 555-0177',
    email: 'david.kim@kimstudio.design',
    treatmentName: 'Medical Hydrafacial MD Elite + Recovery Cream',
    cartTotalCents: 41000,
    depositAmountCents: 5000,
    dropoffStage: 'deposit_auth',
    dropoffStageLabel: 'Apple Pay Checkout',
    abandonedAt: '3 hours ago',
    timeAgo: '3h ago',
    status: 'pending_auto_sms',
    recoveryDiscountOffer: '$25 Product Credit',
    suggestedSmsText: 'Hi David! We saved your Hydrafacial MD appointment. Enjoy a $25 clinical credit applied at check-in: https://auramedspa.com/book/hydrafacial'
  }
];

// ==========================================
// SEED DATA: CAPACITY SPOTTER SLOTS
// ==========================================
export const INITIAL_CAPACITY_SLOTS: import('../types').CapacitySlot[] = [
  {
    id: 'cap-1',
    providerName: 'Dr. Sarah Jenkins, MD',
    providerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    roomName: 'Suite 1 (Physician Injectable Suite)',
    dateStr: 'This Friday',
    timeWindow: '2:00 PM – 3:30 PM (90 Min Gap)',
    durationMinutes: 90,
    idleCategory: 'doctor_gap',
    potentialRevenueCents: 125000,
    recommendedTreatments: ['Morpheus8 RF Dermal Lift', 'Full-Face Tox Balancing', 'Lip Architecture'],
    flashDiscountPercent: 15,
    matchingWaitlistPatientsCount: 14,
    flashSmsPreview: '⚡ Aura MedSpa Flash Opening: Dr. Jenkins had a rare 2:00 PM Friday opening open up! Claim $150 off Morpheus8 or $75 off Tox: https://auramedspa.com/flash/jenkins-fri',
    isBroadcasted: false
  },
  {
    id: 'cap-2',
    providerName: 'Laser Tech Room',
    providerAvatar: 'https://images.unsplash.com/photo-1512290900672-1f023075b9f9?auto=format&fit=crop&w=200&q=80',
    roomName: 'Laser Suite 2 (InMode Morpheus8 / Sciton)',
    dateStr: 'This Thursday',
    timeWindow: '11:00 AM – 2:00 PM (3 Hours Idle)',
    durationMinutes: 180,
    idleCategory: 'laser_room_idle',
    potentialRevenueCents: 170000,
    recommendedTreatments: ['Morpheus8 RF Dermal Lift', 'Laser Genesis Collagen Stimulator'],
    flashDiscountPercent: 20,
    matchingWaitlistPatientsCount: 22,
    flashSmsPreview: '⚡ Urgent Flash Sale: Laser Suite 2 available Thursday 11am-2pm. $200 instant savings on Morpheus8 RF: https://auramedspa.com/flash/laser-thu',
    isBroadcasted: false
  },
  {
    id: 'cap-3',
    providerName: 'Nurse Sarah Reynolds, BSN',
    providerAvatar: 'https://images.unsplash.com/photo-1594824813580-0a568cfa823d?auto=format&fit=crop&w=200&q=80',
    roomName: 'Aesthetician Glow Bar',
    dateStr: 'Tomorrow Morning',
    timeWindow: '10:00 AM – 11:00 AM (60 Min)',
    durationMinutes: 60,
    idleCategory: 'nurse_opening',
    potentialRevenueCents: 32500,
    recommendedTreatments: ['Medical Hydrafacial MD Elite'],
    flashDiscountPercent: 15,
    matchingWaitlistPatientsCount: 9,
    flashSmsPreview: '⚡ Last-minute glow: Nurse Sarah has an open 10am Hydrafacial slot tomorrow. Claim with $50 off: https://auramedspa.com/flash/glow-tomorrow',
    isBroadcasted: true
  }
];

// ==========================================
// SEED DATA: CLINICAL AFTERCARE RECORDS
// ==========================================
export const INITIAL_AFTERCARE_RECORDS: import('../types').ClinicalAftercareRecord[] = [
  {
    id: 'aft-1',
    patientName: 'Samantha Brooks',
    patientPhone: '(310) 555-8812',
    procedureName: 'Morpheus8 RF Dermal Lift',
    providerName: 'Dr. Sarah Jenkins, MD',
    treatedDate: '3 days ago',
    daysPostTreatment: 3,
    milestoneCheck: 'Day 3 Tenderness',
    status: 'verified_normal',
    patientPhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    patientSymptomsFeedback: 'Mild pinkness around cheeks, tiny micro-crusts fading rapidly. Zero pain. Applying prescribed barrier cream 3x daily.',
    complianceChecked: true,
    googleReviewEligible: false,
    timelineLogs: [
      { sender: 'system', message: 'Day 1 Post-Care SMS sent: Reminded to avoid retinoids & heat for 72 hours.', timestamp: '3 days ago' },
      { sender: 'patient', message: 'Submitted photo check-in: Feeling great! Redness is 80% gone already.', timestamp: 'Yesterday' },
      { sender: 'clinician', message: 'Dr. Jenkins reviewed photo: Excellent healing progression, collagen contraction on track.', timestamp: 'Today 9:15 AM' }
    ]
  },
  {
    id: 'aft-2',
    patientName: 'Amanda Collins',
    patientPhone: '(424) 555-9011',
    procedureName: 'Full-Face Tox Balancing (40 Units)',
    providerName: 'Dr. Sarah Jenkins, MD',
    treatedDate: '14 days ago',
    daysPostTreatment: 14,
    milestoneCheck: 'Day 14 Touch-up & Review',
    status: 'review_prompted',
    patientPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    patientSymptomsFeedback: 'Forehead lines completely smooth, zero heaviness in brows! Loving the results.',
    complianceChecked: true,
    googleReviewEligible: true,
    timelineLogs: [
      { sender: 'system', message: 'Day 14 final clinical result milestone reached.', timestamp: 'Today 8:00 AM' },
      { sender: 'patient', message: 'Verified 5/5 satisfaction score with zero touch-up needed.', timestamp: 'Today 10:20 AM' },
      { sender: 'system', message: 'Automated 5-Star Google Review invitation sent with 1-click link.', timestamp: 'Today 10:25 AM' }
    ]
  },
  {
    id: 'aft-3',
    patientName: 'Julianne Ward',
    patientPhone: '(310) 555-4309',
    procedureName: 'Lip Architecture & Micro-Contour',
    providerName: 'Dr. Sarah Jenkins, MD',
    treatedDate: 'Yesterday',
    daysPostTreatment: 1,
    milestoneCheck: 'Day 1 Check-in',
    status: 'awaiting_photo',
    patientSymptomsFeedback: 'Mild swelling on upper lip (expected). Applying cold compress every 2 hours.',
    complianceChecked: true,
    googleReviewEligible: false,
    timelineLogs: [
      { sender: 'system', message: 'Day 1 Post-filler check-in SMS sent: "Hi Julianne, please avoid hot saunas and intense workouts today."', timestamp: 'Today 8:00 AM' }
    ]
  }
];

export { schema };
