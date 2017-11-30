import { ITempData } from './../../interfaces/ITempData';
export class TokenResponseModel implements ITempData {
    access_token: string;
    refresh_token: string;    
}