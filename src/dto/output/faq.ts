import { IFaq } from "../../models/faq";

export class FaqOutputDto {
  title: string;
  description: string;

  constructor(f: IFaq) {
    this.title = f.title;
    this.description = f.description;
  }
}
