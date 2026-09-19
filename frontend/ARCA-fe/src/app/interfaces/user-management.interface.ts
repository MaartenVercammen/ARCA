export type User = {
  username: string;
  email: string;
  phoneNumber: string;
  address: Address;
  roles: string[];
};

export type Address = {
  street: string;
  houseNumber: string;
  city: string;
  zipCode: string;
  country: string;
};
