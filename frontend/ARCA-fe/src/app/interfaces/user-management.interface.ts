export type User = {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  address: Address | null;
  roles: string[];
};

export type Address = {
  street: string;
  houseNumber: string;
  city: string;
  zipCode: string;
  country: string;
};
