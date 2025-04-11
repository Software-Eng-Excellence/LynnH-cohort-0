interface Handler {
    handle(input: any): void;
    setNextHandler(handler: Handler): void;
  }
  class BaseHandler {
    private next?:Handler;
  
    handle(request: any) {
      if (this.next) {
        return this.next.handle(request);
      }
      return "Request not handled";
    }
    setNextHandler(next: Handler) {
      this.next = next;
    }
  }