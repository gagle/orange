export interface Configuration {
  port: number;
  globalPrefix: string;
}

export const configuration = (): Configuration => ({
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
  globalPrefix: 'api',
});
