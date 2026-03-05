// account data types
export interface AccountFormData {
    name: string;
    email: string;
    password: string;
    account_type: string;
}

export interface ServiceResponse {
    success: boolean;
    message: string;
    token?: string;
    data?: any;
}