export interface UserData {
  [key: string]: any;
  id: number;
  firstName: string;
  lastName: string;
  // ...other fields...
}

export interface FormField {
  color: string;
  type: string;
}

export interface FormFields {
  [key: string]: FormField;
}
