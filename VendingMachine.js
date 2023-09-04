import {Stock} from "./Stock";
import {Payment} from "./Payment";

export class VendingMachine extends Stock, Payment {
  #paymentHistory = [];
  #userPaymentType = '';

  constructor() {
    super();
  }

  startUserTransaction(User) {
    this.#userPaymentType = User.paymentType;
  }

  endUserTransaction() {
    this.#userPaymentType = '';
  }

  purchaseItemBy(User, itemName) {
    let paymentId;
    try {
      this.startUserTransaction(User);
      this.checkItemInStock(itemName);
      const amountToPay = this.getItemPriceBy(itemName);
      paymentId = this.pay(amountToPay);
      this.takeItemBy(itemName);
      this.storePurchaseHistory(User, paymentId, itemName, true, amountToPay);
      console.log(`${itemName} 구매에 성공했어요!`);
    } catch (error) {
      if (paymentId) {
        const amountToRollback = this.#paymentHistory.find(
            (payment) => payment.paymentId === paymentId);
        vm211.rollbackPayment(amountToRollback);
        this.storePurchaseHistory(User, paymentId, itemName, false,
            amountToRollback);
      }

      console.error(error);
    }

    vm211.endUserTransaction();
  }

  storePurchaseHistory(User, paymentId, itemName, isPlus, amountToPay) {
    const now = new Date();
    const userId = User.userId;
    this.#paymentHistory.push(
        {userId, paymentId, itemName, isPlus, amountToPay, now});
  }

  getPurchaseHistory() {
    return this.#paymentHistory;
  }

}

// Payment를 정의한 이유는, 초기 셋팅 이후 하드웨어는 거의 변경이 없다고 판단!
// 1. 자판기 셋팅
const vm211 = new VendingMachine();
vm211.register(new Card());
vm211.register(new Money());
vm211.initItemInStock({itemName: '콜라', itemPrice: 1100, itemCount: 5});
vm211.initItemInStock({itemName: '물', itemPrice: 600, itemCount: 3});
vm211.initItemInStock({itemName: '커피', itemPrice: 700, itemCount: 2});
console.log("유저에게 제공할 수 있는 아이템 -->", vm211.getStock());

// 2. 유저별 트랜잭션 관리
const user1Money = new User(vm211.paymentType); // 자판기에서 제공하는 결제타입 - 돈이라고 가정
vm211.insert(1000);
vm211.insert(500);
console.log(vm211.getMoney()); // 유저가 넣은 금액을 볼 수 있음
const user1Option1 = "콜라"; // 유저가 마시고 싶은 음료 가정
const user1Option2 = "커피"; // 유저가 마시고 싶은 음료 가정

// 유저 결제 프로세스
vm211.purchaseItemBy(user1Money, user1Option1);
vm211.purchaseItemBy(user1Money, user1Option2);

// 3. (필요시) 구매 데이터 조회

// TODO 카드일경우 어떻게 처리할건지..