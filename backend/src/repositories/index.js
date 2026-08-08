import { prisma } from '../database/prisma.js';
import { createRepository } from './baseRepository.js';

export const userRepository = createRepository(prisma.user);
export const doctorRepository = createRepository(prisma.doctor);
export const specialtyRepository = createRepository(prisma.specialty);
export const doctorSpecialtyRepository = Object.freeze({
  findMany: (options = {}) => prisma.doctorSpecialty.findMany(options),
  create: (data) => prisma.doctorSpecialty.create({ data }),
  delete: (doctorId, specialtyId) => prisma.doctorSpecialty.delete({ where: { doctorId_specialtyId: { doctorId, specialtyId } } }),
});
export const patientRepository = createRepository(prisma.patient);
export const appointmentRepository = createRepository(prisma.appointment);
export const notificationRepository = createRepository(prisma.notification);
export const settingsRepository = createRepository(prisma.settings);
export const sessionRepository = createRepository(prisma.session);
