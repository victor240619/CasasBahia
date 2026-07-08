export const PAYMENT_MODES = {
  STRIPE: "stripe",
};

export const subscriptionPlans = [
  {
    id: "sub-10",
    name: "Plano Essencial",
    amountCents: 1000,
    interval: "month",
  },
  {
    id: "sub-25",
    name: "Plano Plus",
    amountCents: 2500,
    interval: "month",
  },
  {
    id: "sub-40",
    name: "Plano Premium",
    amountCents: 4000,
    interval: "month",
  },
];
