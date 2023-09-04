import {Stock} from "./Stock.js";
import {Payment} from "./Payment.js";

export class VendingMachine {
  #paymentHistory;
  #userPaymentType;
  stock;
  payment;

  constructor() {
    this.#paymentHistory = [];
    this.#userPaymentType = '';
    this.stock = new Stock();
    this.payment = new Payment();
  }

  startUserTransaction(User) {
    if (!this.#userPaymentType) {
      this.#userPaymentType = User.paymentType;
    }
  }

  endUserTransaction() {
    this.#userPaymentType = '';
    this.payment.returnChanges();
  }

  purchaseItemBy(User, itemName) {

    let paymentId;
    try {
      this.stock.checkItemInStock(itemName);
      const amountToPay = this.stock.getItemPriceBy(itemName);
      paymentId = this.payment.pay(User, amountToPay);
      this.stock.takeItemBy(itemName);
      this.storePurchaseHistory(User, paymentId, itemName, true, amountToPay);
      console.log(
          `[구매] ${amountToPay.toLocaleString()}원짜리 "${itemName}" 구매에 성공했어요!`);
    } catch (error) {
      if (paymentId) {
        const amountToRollback = this.#paymentHistory.find(
            (payment) => payment.paymentId === paymentId);
        this.payment.rollbackPayment(amountToRollback);
        this.storePurchaseHistory(User, paymentId, itemName, false,
            this.#userPaymentType, amountToRollback);
      }

      console.error(error.message);
    }
  }

  storePurchaseHistory(User, paymentId, itemName, isPlus, amountToPay,
      paymentType) {
    const now = new Date();
    const userId = User.userId;
    this.#paymentHistory.push(
        {userId, paymentId, itemName, isPlus, amountToPay, paymentType, now});
  }

  getPurchaseHistory() {
    return this.#paymentHistory;
  }
}