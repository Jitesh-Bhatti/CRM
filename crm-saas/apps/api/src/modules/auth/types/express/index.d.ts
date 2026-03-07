declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: string;
        organizationId: string;
      };
    }
  }
}

// This empty export is necessary to make this a module rather than a global script
export {};