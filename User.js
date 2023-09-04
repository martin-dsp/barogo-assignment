export class User {
  userId;
  paymentType;

  constructor() {
    this.userId = Math.random().toString(16).substring(2, 10);
    this.paymentType = undefined;
    console.log(`----- [${this.userId}] 유저가 생성되었습니다. -----`);
  }
}