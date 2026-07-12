const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const loadOneButton = document.querySelector("#load-item");
const itemList = document.querySelector("#items");
const oneItem = document.querySelector("#item");
const form = document.querySelector("#add-item-form");
const updateForm = document.querySelector("#update-item-form");
const deleteForm = document.querySelector("#delete-item-form");
const loadForm = document.querySelector("#load-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const itemCategoryInput = document.querySelector("#item-category");
const itemIdInput = document.querySelector("#item-id");
const statusBox = document.querySelector("#status");
const itemStatusBox = document.querySelector("#item-status");

function setStatus(message) {
  statusBox.textContent = message;
}

function setStatusItem(message) {
  itemStatusBox.textContent = message;
}

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = `${item.id}: ${item.name} (${item.quantity}) (${item.category})`;
    itemList.appendChild(li);
  }
}

function renderItem(item) {
  oneItem.replaceChildren();

  const li = document.createElement("li");
  li.textContent = `${item.id}: ${item.name} (${item.quantity}) (${item.category})`;
  oneItem.appendChild(li);
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);

    if (!response.ok) {
      throw new Error(`GET /api/items failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function loadItem(id) {
  setStatusItem("Loading item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`);

    if (!response.ok) {
      throw new Error(`GET /api/items/${id} failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItem(data.item);
    setStatusItem("Item loaded.");
  } catch (error) {
    setStatusItem(error.message);
  }
}

async function addItem(name, quantity, category) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity, category })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function updateItem(id, name, quantity, category) {
  setStatus("Update item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity, category })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `PATCH /api/items failed with status ${response.status}`);
    }

    setStatus(`Updated item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteItem(id) {
  setStatus("Deleting item...");

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/items/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ??
          `DELETE /api/items/${id} failed with status ${response.status}`
      );
    }

    setStatus(`Deleted item: ${data.item.name}`);

    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}



loadButton.addEventListener("click", loadItems);

loadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadItem(document.querySelector("#load-item-id").value);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);
  const category = itemCategoryInput.value.trim();

  if (!name || !Number.isInteger(quantity) || quantity < 0 || !category) {
    setStatus("Enter a name, category, and a non-negative integer quantity.");
    return;
  }

  itemNameInput.value = "";
  itemQuantityInput.value = "0";
  itemCategoryInput.value = "";
  await addItem(name, quantity, category);
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log("Update form submitted");

  const updateIdInput = document.querySelector("#update-item-id");
  const updateNameInput = document.querySelector("#update-item-name");
  const updateQuantityInput = document.querySelector(
    "#update-item-quantity"
  );
  const updateCategoryInput = document.querySelector("#update-item-category");

  const id = Number(updateIdInput.value);
  const name = updateNameInput.value.trim();
  const quantity = Number(updateQuantityInput.value);
  const category = updateCategoryInput.value.trim();

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !name ||
    !Number.isInteger(quantity) ||
    quantity < 0 ||
    !category
  ) {
    setStatus(
      "Enter a positive item ID, a name, a category, and a non-negative integer quantity."
    );
    return;
  }

  await updateItem(id, name, quantity, category);
});

deleteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log("Delete form submitted");

  const deleteIdInput = document.querySelector("#delete-item-id");
  const id = Number(deleteIdInput.value);

  if (!Number.isInteger(id) || id <= 0) {
    setStatus("Enter a positive integer item ID.");
    return;
  }

  await deleteItem(id);

});
