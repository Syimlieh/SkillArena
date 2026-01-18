declare module "@cashfreepayments/cashfree-js" {
  type CashfreeMode = "sandbox" | "production";

  type CheckoutOptions = {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal" | HTMLElement;
  };

  type CashfreeInstance = {
    checkout: (options: CheckoutOptions) => Promise<unknown>;
  };

  export function load(options: { mode: CashfreeMode }): Promise<CashfreeInstance>;
}
