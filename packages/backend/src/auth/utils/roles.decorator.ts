import { Reflector } from '@nestjs/core';
import { Role } from './role';

export const Roles = Reflector.createDecorator<Role[]>();