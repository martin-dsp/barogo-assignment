export class User {
  constructor() {
    this.userId = Math.random().toString(16).substring(2, 10);
    console.log(`----- [${this.userId}] 유저가 생성되었습니다. -----`);
  }
}