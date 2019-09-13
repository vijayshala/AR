import { QuoteDetails } from "./quoteDetails";

export class UploadData {
  author: string;
  byteSize: number;
  ddocName: string;
  did: number;
  drevisionID: number;
  localReference: string;
  name: string;
  remoteReference: string;
  remoteSystem: string;
  selectedQuoteList:Array<QuoteDetails>;
  statusCode: number;
  statusMessage: string;
  title: string;
  type: string;
  autorenewId:string;
  poAmount:string;
  poExpiryDate:string;
  poNumber:string;
  poRequired: string;
}
