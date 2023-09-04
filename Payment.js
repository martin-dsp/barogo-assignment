export class Payment {
  paymentType;
  userMoneyBalance;
  machineMoneyBalance;

  constructor() {
    this.userMoneyBalance = 0;
  }

  //////////////////////// 돈 메서드 ////////////////////////
  initMoney(money) {
    this.machineMoneyBalance = new Map(money);
  }

  insert(amount) {
    console.log(`${amount.toLocaleString()}원을 넣었습니다.`);

    if ([100, 500, 1000, 5000, 10000].includes(amount)) {
      this.paymentType = "money";
      this.userMoneyBalance += amount;
      this.machineMoneyBalance.set(amount,
          this.machineMoneyBalance.get(amount) + 1);
    } else {
      console.error("반환됩니다. 유효하지 않은 돈입니다.");
    }

    this.getUserMoneyBalance();
  }

  getUserMoneyBalance() {
    console.log(`총액은 ${this.userMoneyBalance.toLocaleString()}원입니다.`);
    return this.userMoneyBalance;
  }

  getMachineMoneyBalance() {
    console.log('자판기 거스름돈 현황:', this.machineMoneyBalance);
    return this.machineMoneyBalance;
  }

  minus(amount) {
    this.userMoneyBalance -= amount;

    return this.generatePaymentId();
  }

  rollbackUserMoneyBalance(amountToRollback) {
    this.userMoneyBalance += amountToRollback;
  }

  //////////////////////// 카드 메서드 ////////////////////////
  setCardAsPayType() {
    // 카드를 넣었을 경우, 카드사에서 결제유효한 카드인지 검사
    console.log('카드로 결제를 시작합니다.');
    this.paymentType = "card";
  }

  checkCardBalance(User, amount) {
    // 유저의 정보와 결제할 금액을 활용하여 카드사에서 카드의 밸런스를 확인한다.
    return true;
  }

  payWithCard(User, amount) {
    // 유저의 정보와 결제할 금액을 활용하여 카드사에 결제를 요청한다.
    return this.generatePaymentId(); // 임시 (카드사에서 결제후 반환하는 결제아이디)
  }

  rollbackCardBalance(User, amount) {
    // 유저의 정보와 롤백할 금액을 활용하여 카드사에 결제롤백을 요청한다.
  }

  //////////////////////// 공통 메서드 ////////////////////////
  pay(User, amountToPay) {
    switch (this.paymentType) {
      case "card":
        if (this.checkCardBalance(User, amountToPay)) {
          return this.payWithCard();
        }
        throw new Error(`카드의 잔액이 부족하여 구매할 수 없어요.`);
      case "money":
        if (amountToPay <= this.userMoneyBalance) {
          return this.minus(amountToPay);
        }
        throw new Error(
            `잔액이 ${(amountToPay
                - this.userMoneyBalance).toLocaleString()}원 부족하여 구매할 수 없어요.`);
      default:
        throw new Error(`"${this.paymentType}"은 등록되지 않은 결제방식이에요. 다시 시도해주세요.`)
    }
  }

  rollbackPayment(amountToRollback) {
    switch (this.paymentType) {
      case "card":
        this.rollbackCardBalance(amountToRollback);
        break;
      case "money":
        this.rollbackUserMoneyBalance(amountToRollback);
        break;
      default:
        throw new Error(`"${this.paymentType}"은 등록되지 않은 결제방식이에요. 다시 시도해주세요.`)
    }
  }

  generatePaymentId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';

    for (let i = 0; i < 20; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
  }

  returnChanges() {
    switch (this.paymentType) {
      case "card":
        console.log("[종료] 카드 결제가 종료되었어요.\n")
        break;
      case "money":
        console.log(
            `[종료] 잔액 ${this.userMoneyBalance.toLocaleString()}원을 반환합니다.`)
        this.calculateChanges();
        this.userMoneyBalance = 0;
        break;
      default:
        throw new Error(`"${this.paymentType}"은 등록되지 않은 결제방식이에요. 다시 시도해주세요.`)
    }
  }

  calculateChanges() {
    let changesToReturn = this.userMoneyBalance;
    const denominationList = Array.from(this.machineMoneyBalance.keys()).sort(
        (a, b) => b - a);

    const changeList = [];
    for (const denomination of denominationList) {
      const count = Math.floor(changesToReturn / denomination);

      if (count > 0) {
        this.machineMoneyBalance.set(denomination,
            this.machineMoneyBalance.get(denomination) - count);
        changesToReturn -= count * denomination;
        changeList.push(
            `${denomination.toLocaleString()}원 ${count.toLocaleString()}개`);
      }
    }
    if (changeList.length) {
      console.log(`(${changeList.join(' / ')})\n`);
    } else {
      console.log('')
    }
  }
}