import 'dotenv/config';

export interface User {
  username: string;
  password: string;
  type: 'standard' | 'locked' | 'problem' | 'performance';
}

export const USERS: Record<string, User> = {
  standard: {
    username: process.env.STANDARD_USER || 'standard_user',
    password: process.env.PASSWORD || 'secret_sauce',
    type: 'standard',
  },
  locked: {
    username: process.env.LOCKED_USER || 'locked_out_user',
    password: process.env.PASSWORD || 'secret_sauce',
    type: 'locked',
  },
  problem: {
    username: process.env.PROBLEM_USER || 'problem_user',
    password: process.env.PASSWORD || 'secret_sauce',
    type: 'problem',
  },
  performance: {
    username: process.env.PERFORMANCE_USER || 'performance_glitch_user',
    password: process.env.PASSWORD || 'secret_sauce',
    type: 'performance',
  },
};