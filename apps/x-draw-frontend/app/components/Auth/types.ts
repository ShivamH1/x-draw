export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface SignupData {
    name: string;
    email: string;
    password: string;
    photo: File | string;
  }
  
  export interface FormErrors {
    [key: string]: string;
  }