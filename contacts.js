const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

const updateContacts = async (contacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");

  return JSON.parse(data);
}

async function getContactById(id) {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === id);

  return result || null;
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();

  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);

  console.table(contacts);
  return newContact;
}

async function updateContact(id, data) {
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  contacts[index] = { id, ...data };

  await updateContacts(contacts);
  console.table(contacts);
  return contacts[index];
}

async function removeContact(id) {
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);
  await updateContacts(contacts);
  console.table(contacts);
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
