-- Add only the authentication fields required by Phase 13.
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
