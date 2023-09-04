export class Payment {
  paymentType;
  money = 0;

  register(paymentClass) {
    this.paymentType = paymentClass;
  };

  insert(amount) {
    this.money += amount;
  }

  getMoney() {
    return this.money;
  }

  minus(amount) {
    this.money -= amount;
  }

  pay(amountToPay) {
    switch (this.paymentType) {
      case "card":
        break;
      case "money":
        if (amountToPay >= this.money) {
          this.minus(amountToPay);
          return this.generatePaymentId();
        }
        throw new Error(`잔액이 ${amountToPay - this.money}만큼 부족하여 구매할 수 없어요.`);
      default:
        throw new Error(`"${type}"은 등록되지 않은 결제방식이에요. 다시 시도해주세요.`)
    }
  }

  rollbackPayment(amountToRollback) {
    this.money += amountToRollback;
  }

  generatePaymentId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';

    for (let i = 0; i < 20; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
  }
}