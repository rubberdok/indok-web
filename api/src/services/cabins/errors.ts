class OverlappingBookingError implements Error {
  name: string = "OverlappingBookingError";
  message: string = "there is already a booking in this period";
  stack?: string | undefined;
  cause?: Error | undefined;
}

export { OverlappingBookingError };
