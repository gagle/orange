export interface Configuration {
  port: number;
  globalPrefix: string;
  apis: {
    jsonPlaceholder: {
      baseUrl: string;
    };
  };
}

export const configuration = (): Configuration => ({
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
  globalPrefix: 'api',
  apis: {
    jsonPlaceholder: {
      baseUrl: 'https://jsonplaceholder.typicode.com',
    },
  },
});
