import type { IncomingMessage, ServerResponse } from 'http';

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

interface UserData {
  user: {
    id: string;
    name: string;
    email: string;
    hobbies: string[];
  };
  links: {
    self: string;
    hobbies: string;
  };
}

interface HobbiesData {
  hobbies: string[];
  links: {
    self: string;
    user: string;
  };
}

interface DeleteUserData {
  success: boolean;
}

interface Route {
  handler: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    matches?: RegExpMatchArray
  ) => Promise<{
    data: null | UserData | UserData[] | HobbiesData | DeleteUserData;
    error: string | null;
  }>;
  cache?: {
    ttl: number;
    private: boolean;
  };
}

export type Routes = Record<HttpMethod, Record<string, Route>>;
