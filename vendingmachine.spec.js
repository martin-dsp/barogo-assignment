import {VendingMachine} from "./VendingMachine.js";
import {COFFEE, COKE, WATER} from "./Stock.js";
import {User} from "./User.js";

describe('자판기 테스트', function () {
  let vm1954;
  let user;

  beforeAll(() => {
    vm1954 = new VendingMachine();
    vm1954.stock.initItem({itemName: COKE, itemPrice: 1100, itemCount: 5});
    vm1954.stock.initItem({itemName: WATER, itemPrice: 600, itemCount: 5});
    vm1954.stock.initItem({itemName: COFFEE, itemPrice: 700, itemCount: 3});
    vm1954.payment.initMoney(
        [[100, 500], [500, 400], [1000, 300], [5000, 100], [10000, 5]]);
  })

  beforeEach(() => {
    user = new User();
    vm1954.startUserTransaction(user);
  })

  test('1,900원을 넣고 "콜라"와 "커피"를 사고 거스름돈을 받은 케이스', () => {
    vm1954.payment.insert(1000);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1000);
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(301);
    vm1954.payment.insert(500);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1500);
    expect(vm1954.payment.getMachineMoneyBalance().get(500)).toBe(401);
    vm1954.payment.insert(100);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1600);
    vm1954.payment.insert(100);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1700);
    vm1954.payment.insert(100);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1800);
    vm1954.payment.insert(100);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1900);
    vm1954.payment.insert(200);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1900);
    vm1954.purchaseItemBy(user, COKE);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(800);
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(4);
    vm1954.purchaseItemBy(user, COFFEE);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(100);
    expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(2);
    vm1954.endUserTransaction();
    expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(503);

    expect(vm1954.getPurchaseHistory().length).toBe(2);
  })

  test('10,000원을 넣고 "물"을 사고 거스름돈을 받은 케이스', () => {
    vm1954.payment.insert(10000);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(10000);
    expect(vm1954.payment.getMachineMoneyBalance().get(10000)).toBe(6);
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(4);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(9400);
    vm1954.endUserTransaction();

    expect(vm1954.payment.getMachineMoneyBalance().get(5000)).toBe(99);
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(297);
    expect(vm1954.payment.getMachineMoneyBalance().get(500)).toBe(401);
    expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(499);

    expect(vm1954.getPurchaseHistory().length).toBe(3);
  })

  test('5,000원을 넣고 "커피" 3개를 순차적으로 사려고 했으나, 재고가 2개밖에 없어서 2개만 사고 거스름돈을 받은 케이스',
      () => {
        vm1954.payment.insert(5000);
        expect(vm1954.payment.getUserMoneyBalance()).toBe(5000);
        expect(vm1954.payment.getMachineMoneyBalance().get(5000)).toBe(100);
        expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(2);
        vm1954.purchaseItemBy(user, COFFEE);
        expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(1);
        vm1954.purchaseItemBy(user, COFFEE);
        expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(0);
        expect(vm1954.payment.getUserMoneyBalance()).toBe(3600);
        vm1954.purchaseItemBy(user, COFFEE);
        expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(0);
        expect(vm1954.payment.getUserMoneyBalance()).toBe(3600);
        vm1954.endUserTransaction();

        expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(294);
        expect(vm1954.payment.getMachineMoneyBalance().get(500)).toBe(400);
        expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(498);

        expect(vm1954.getPurchaseHistory().length).toBe(5);
      })

  test('5,000원을 넣고 "커피" 1개를 사려고 했으나, 재고가 없어서 물을 사고 거스름돈을 받은 케이스', () => {
    vm1954.payment.insert(5000);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(5000);
    expect(vm1954.payment.getMachineMoneyBalance().get(5000)).toBe(101);
    expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(0);
    vm1954.purchaseItemBy(user, COFFEE);
    expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(0);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(4);
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(3);
    vm1954.endUserTransaction();

    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(290);
    expect(vm1954.payment.getMachineMoneyBalance().get(500)).toBe(400);
    expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(494);

    expect(vm1954.getPurchaseHistory().length).toBe(6);
  })

  test('1,000원을 넣고 "물"을 2개를 사려고 했으나, 돈이 부족해서 물 1개만 사고 거스름돈을 받은 케이스', () => {
    vm1954.payment.insert(1000);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1000);
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(291);
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(400);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(2);
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(400);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(2);
    vm1954.endUserTransaction();

    expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(490);

    expect(vm1954.getPurchaseHistory().length).toBe(7);
  })

  test('1,000원을 넣고 사고 싶은 게 없어서 그대로 반환 받은 케이스', () => {
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(291);
    vm1954.payment.insert(1000);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1000);
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(292);
    vm1954.endUserTransaction();
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(291);

    expect(vm1954.getPurchaseHistory().length).toBe(7);
  })

  test('1,000원을 넣고 "콜라"를 사려고 했으나, 돈이 부족해서 100원 더 넣고 콜라 1개를 산 케이스', () => {
    vm1954.payment.insert(1000);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1000);
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(292);
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(4);
    vm1954.purchaseItemBy(user, COKE);
    vm1954.payment.insert(100);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(1100);
    expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(491);
    vm1954.purchaseItemBy(user, COKE);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(0);
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(3);
    vm1954.endUserTransaction();

    expect(vm1954.payment.getMachineMoneyBalance().get(10000)).toBe(6);
    expect(vm1954.payment.getMachineMoneyBalance().get(5000)).toBe(101);
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(292);
    expect(vm1954.payment.getMachineMoneyBalance().get(500)).toBe(400);
    expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(491);

    expect(vm1954.getPurchaseHistory().length).toBe(8);
  })

  test('유효하지 않은 동전을 넣어서 튕긴 케이스', () => {
    vm1954.payment.insert(200);
    expect(vm1954.payment.getUserMoneyBalance()).toBe(0);
    vm1954.endUserTransaction();

    expect(vm1954.payment.getMachineMoneyBalance().get(10000)).toBe(6);
    expect(vm1954.payment.getMachineMoneyBalance().get(5000)).toBe(101);
    expect(vm1954.payment.getMachineMoneyBalance().get(1000)).toBe(292);
    expect(vm1954.payment.getMachineMoneyBalance().get(500)).toBe(400);
    expect(vm1954.payment.getMachineMoneyBalance().get(100)).toBe(491);

    expect(vm1954.getPurchaseHistory().length).toBe(8);
  })

  test('카드로 커피를 산 케이스', () => {
    vm1954.payment.setCardAsPayType();
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(3);
    vm1954.purchaseItemBy(user, COKE);
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(2);
    vm1954.endUserTransaction();

    expect(vm1954.getPurchaseHistory().length).toBe(9);
  })

  test('카드로 "커피"를 3개 사려고 했으나, 2개밖에 없어서 2개사고 종료한 케이스', () => {
    vm1954.payment.setCardAsPayType();
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(2);
    vm1954.purchaseItemBy(user, COKE);
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(1);
    vm1954.purchaseItemBy(user, COKE);
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(0);
    vm1954.purchaseItemBy(user, COKE);
    expect(vm1954.stock.getStock().get(COKE).itemCount).toBe(0);
    vm1954.endUserTransaction();

    expect(vm1954.getPurchaseHistory().length).toBe(11);
  })

  test('물을 2개 사려고 했으나, 1개 사고나서 카드 밸런스가 없어서 살 수 없는 케이스', () => {
    vm1954.payment.setCardAsPayType();
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(2);
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(1);
    vm1954.payment.checkCardBalance = (User, amount) => false;
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(1);
    vm1954.endUserTransaction();
  })

  test('처음부터 카드 밸런스가 존재하지 않아, 구매를 진행할 수 없는 케이스', () => {
    vm1954.payment.setCardAsPayType();
    vm1954.payment.checkCardBalance = (User, amount) => false;
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(1);
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(1);
    vm1954.endUserTransaction();

    // 복구
    vm1954.payment.checkCardBalance = (User, amount) => true;
  })

  test('카드에 밸런스는 존재하며, 커피를 사려고 했으나 재고가 없어서 구매를 진행할 수 없는 케이스', () => {
    vm1954.payment.setCardAsPayType();
    expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(0);
    vm1954.purchaseItemBy(user, COFFEE);
    expect(vm1954.stock.getStock().get(COFFEE).itemCount).toBe(0);
    vm1954.endUserTransaction();
  })

  test('유효하지 않은 결제 방식을 선택한 경우 진행 불가', () => {
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(1);
    vm1954.purchaseItemBy(user, WATER);
    expect(vm1954.stock.getStock().get(WATER).itemCount).toBe(1);
    vm1954.endUserTransaction();
  })
});