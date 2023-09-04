export class Stock {
  #itemMap = new Map();

  initItemInStock({itemName, itemPrice, itemCount}) {
    if (this.#itemMap.get(itemName)) {
      console.error(`이미 "${itemName}" 아이템이 존재해요. 다시 등록해주세요.`);
      return;
    }
    this.#itemMap.set(itemName, {itemPrice, itemCount});
  }

  getStock() {
    return this.#itemMap;
  }

  checkItemInStock(itemName) {
    // 스톡에 존재하지 않는 아이템을 선택할 경우
    if (!this.#itemMap.has(itemName)) {
      throw new Error(`해당 "${itemName}"은 존재하지 않아요. 다른 아이템을 선택해주세요.`);
    }

    // 재고가 없는 경우
    if (this.#itemMap.get(itemName) === 0) {
      throw new Error(`해당 "${itemName}"은 재고가 없어요. 다른 아이템을 선택해주세요.`);
    }
  }

  takeItemBy(itemName) {
    const item = this.#itemMap.get(itemName);
    this.#itemMap.set(itemName, {...item, itemCount: item.itemCount - 1});
  }

  addItemBy(itemName, itemCountToAdd) {
    // 스톡에 존재하지 않는 아이템을 선택할 경우
    if (!this.#itemMap.has(itemName)) {
      console.error(`해당 "${itemName}"은 존재하지 않아요. 아이템 등록 후 사용해주세요.`);
      return;
    }

    const item = this.#itemMap.get(itemName);
    this.#itemMap.set(itemName,
        {...item, itemCount: item.itemCount + itemCountToAdd});
  }

  getItemPriceBy(itemName) {
    return this.#itemMap.get(itemName).itemPrice;
  }
}