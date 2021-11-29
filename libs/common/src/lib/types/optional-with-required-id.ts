export type OptionalWithRequiredId<T, K extends keyof T> = Omit<Partial<T>, K> & Required<Pick<T, K>>;
