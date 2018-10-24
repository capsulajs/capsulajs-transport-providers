// Base class for different Dispatchers

export abstract class Dispatcher {
  // Base URL
  protected baseUrl: string;

  // Base Constructor
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  };

  // Interface for the Dispatcher
  abstract dispatch<T, R>(api: string, request: T): Promise<R>;

  // Optional Destructor-like method
  finalize?(): Promise<void>;
};
