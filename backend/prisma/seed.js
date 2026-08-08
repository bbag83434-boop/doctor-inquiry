import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cardiology = await prisma.specialty.upsert({
    where: { name: 'Cardiology' },
    update: {},
    create: { name: 'Cardiology', description: 'Heart and cardiovascular care.' },
  });
  const dermatology = await prisma.specialty.upsert({
    where: { name: 'Dermatology' },
    update: {},
    create: { name: 'Dermatology', description: 'Skin, hair, and nail care.' },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'dr.asha@example.com' },
    update: {},
    create: { email: 'dr.asha@example.com', fullName: 'Dr. Asha Sen', phone: '+919000000001', role: UserRole.DOCTOR },
  });
  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      licenseNumber: 'MED-DEMO-001',
      bio: 'Demo physician for development environments.',
      experienceYears: 12,
      consultationFee: 800,
      specialties: { create: [{ specialtyId: cardiology.id }, { specialtyId: dermatology.id }] },
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient.rahim@example.com' },
    update: {},
    create: { email: 'patient.rahim@example.com', fullName: 'Rahim Ahmed', phone: '+919000000002', role: UserRole.PATIENT },
  });
  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: { userId: patientUser.id, dateOfBirth: new Date('1990-05-15'), gender: 'Male' },
  });

  const appointment = await prisma.appointment.upsert({
    where: { id: 'demo-appointment-001' },
    update: {},
    create: {
      id: 'demo-appointment-001',
      doctorId: doctor.id,
      patientId: patient.id,
      scheduledAt: new Date('2030-01-15T10:00:00.000Z'),
      reason: 'Routine consultation',
    },
  });

  await prisma.settings.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: { userId: patientUser.id },
  });
  await prisma.notification.upsert({
    where: { id: 'demo-notification-001' },
    update: {},
    create: {
      id: 'demo-notification-001',
      userId: patientUser.id,
      appointmentId: appointment.id,
      type: 'APPOINTMENT',
      title: 'Appointment request received',
      message: 'Your demo appointment request has been created.',
    },
  });

  console.log('Demo data seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
