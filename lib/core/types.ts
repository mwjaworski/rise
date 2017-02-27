export type timestamp = number;
export type integer = number;
export type Queue<T> = Array<T>;

export interface IMessage {
  [key: string]: any;
}
export interface IFilter {
  shape: IMessage;
  delay: number;  
}