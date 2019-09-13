import { ChaseDetails } from './chaseDetails';
import { Page } from './page';

export class Chases{
    chaseList : Array<ChaseDetails>;
    page: Page;
    po_SUBMIT_VISIBLE:string;
    handleId:string;
    is_RESELLER:string;
}