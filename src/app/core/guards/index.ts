import { AdminGuard } from './admin.guard';
import { AuthGuard } from './auth.guard';

export const guards = [AuthGuard, AdminGuard];

export * from './auth.guard';
export * from './admin.guard';
