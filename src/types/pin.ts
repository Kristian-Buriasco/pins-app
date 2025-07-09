export interface Pin {
    objectId: string; // MongoDB ObjectId
  id: string;
  name: string;
  description: string;
  photos: string[];
  locationFound: string;
  category: string;
  countryOfOrigin: string;
  eventOfOrigin: string;
  value: number; // 1-10
  dateFound: string;
  timeFound: string;
  transactionHistory: Transaction[];
  specialCharacteristics: string[];
  totalCount: number;
  tradeableCount: number;
}

export interface Transaction {
  date: string;
  description: string;
}
