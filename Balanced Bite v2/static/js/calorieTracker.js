// Storage Controller
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      let items = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    },
    getItemFromStorage: function () {
      return localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items = items.filter(item => item.id !== id);
      localStorage.setItem('items', JSON.stringify(items));
    },
    removeAllItems: function () {
      localStorage.removeItem('items');
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calories = parseInt(calories);
      let newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    getItemByID: function (id) {
      return data.items.find(item => item.id === id);
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      data.items = data.items.filter(item => item.id !== id);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    calorieGoalInput: '#calorie-goal',
    calorieGoalDisplay: '.calorie-goal',
    goalForm: '#goal-form',
  };

  return {
    populateItemList: function (items) {
      let html = '';
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}</strong> - <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>`;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}</strong> - <em>${item.calories} calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}</strong> - <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(item => {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function () {
      return UISelectors;
    },
    displayCalorieGoal: function (goal) {
      document.querySelector(UISelectors.calorieGoalDisplay).textContent = goal;
    },
    showWarning: function (show) {
      const totalCaloriesEl = document.querySelector(UISelectors.totalCalories);
      if (show) {
        totalCaloriesEl.classList.add('exceed-goal');
      } else {
        totalCaloriesEl.classList.remove('exceed-goal');
      }
    }       
  };
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    document.querySelector(UISelectors.goalForm).addEventListener('submit', setCalorieGoal);
    document.querySelector(UISelectors.resetGoalBtn).addEventListener('click', resetCalorieGoal);  // Add this line
  };

  const itemAddSubmit = function (e) {
    const input = UICtrl.getItemInput();
    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      StorageCtrl.storeItem(newItem);
      UICtrl.clearInput();
      checkCalorieGoal(totalCalories);
    }
    e.preventDefault();
  };

  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemByID(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    const input = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateListItem(updatedItem);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
    checkCalorieGoal(totalCalories);
    e.preventDefault();
  };

  const itemDeleteSubmit = function (e) {
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.deleteItemStorage(currentItem.id);
    UICtrl.clearEditState();
    checkCalorieGoal(totalCalories);
    e.preventDefault();
  };

  const clearAllItemsClick = function () {
    ItemCtrl.clearAllItems();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.removeItems();
    StorageCtrl.removeAllItems();
    UICtrl.hideList();
    UICtrl.clearEditState();
    checkCalorieGoal(totalCalories);
  };

  const setCalorieGoal = function (e) {
    e.preventDefault();
    const goalInput = document.querySelector(UICtrl.getSelectors().calorieGoalInput).value;
    const goal = parseInt(goalInput);
    if (!isNaN(goal) && goal > 0) {
      localStorage.setItem('calorieGoal', goal);
      UICtrl.displayCalorieGoal(goal);
      checkCalorieGoal(ItemCtrl.getTotalCalories());
    }
  };

  const resetCalorieGoal = function () {
    localStorage.removeItem('calorieGoal');
    UICtrl.displayCalorieGoal('');  // Clear the displayed goal
    checkCalorieGoal(ItemCtrl.getTotalCalories());  // Check if current total exceeds the (now removed) goal
  };

  const checkCalorieGoal = function (totalCalories) {
    const goal = parseInt(localStorage.getItem('calorieGoal'));
    if (!isNaN(goal)) {
      if (totalCalories > goal) {
        UICtrl.showWarning(true);
      } else {
        UICtrl.showWarning(false);
      }
    } else {
      UICtrl.showWarning(false);  // Ensure warning is hidden if no goal is set
    }
  };

  return {
    init: function () {
      UICtrl.clearEditState();
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      const storedGoal = localStorage.getItem('calorieGoal');
      if (storedGoal) {
        UICtrl.displayCalorieGoal(storedGoal);
        checkCalorieGoal(totalCalories);
      }
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
