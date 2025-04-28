//fs: A built-in Node.js module used to work with the file system. It lets you read from and write to files.

import fs from 'fs';
//path: A built-in Node.js module that helps you work with file and directory paths in a platform-independent way.

import path from 'path';
import { Contact, Category } from './contact';
import inquirer from 'inquirer';

// Define the file path where contacts are saved
const filePath = path.join(__dirname, '..', 'contacts.json');

// Function to save contacts to the file
function saveContacts(contacts: Contact[]) {
  fs.writeFileSync(filePath, JSON.stringify(contacts));
}

// Function to load contacts from the file
function loadContacts(): Contact[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Function to add a new contact
export async function addContact() {
  const contacts = loadContacts();

  const { name, email, phone, category } = await inquirer.prompt([
    { name: 'name', type: 'input', message: 'Enter contact name:' },
    { name: 'email', type: 'input', message: 'Enter contact email:' },
    { name: 'phone', type: 'input', message: 'Enter contact phone number:' },
    { name: 'category', type: 'list', message: 'Choose contact category:', choices: Object.values(Category) },
  ]);

  const newContact: Contact = {
    id: contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
    name,
    email,
    phone,
    category: category as Category,
  };

  contacts.push(newContact);
  saveContacts(contacts);
  console.log('Contact added!');
}

// Function to view all contacts
export async function viewContacts() {
  const contacts = loadContacts();
  if (contacts.length === 0) {
    console.log('No contacts available.');
  } else {
    console.table(contacts);
  }
}

// Function to delete a contact by ID
export async function deleteContact() {
  const contacts = loadContacts();

  if (contacts.length === 0) {
    console.log('No contacts available.');
    return;
  }

  const { id } = await inquirer.prompt({
    name: 'id',
    type: 'input',
    message: 'Enter the ID of the contact to delete:',
    validate: (input: string) => {
      const numberInput = Number(input); 
      return !isNaN(numberInput) && numberInput > 0
        ? true
        : 'Please enter a valid ID (positive number)';
    },
  });
  

  const contactIndex = contacts.findIndex(contact => contact.id === Number(id));

  if (contactIndex === -1) {
    console.log('Contact not found!');
  } else {
    contacts.splice(contactIndex, 1); //array.splice(startIndex, deleteCount)

    saveContacts(contacts);
    console.log('Contact deleted!');
  }
}

// Function to filter contacts by category
export async function filterContacts() {
  const contacts = loadContacts();

  const { category } = await inquirer.prompt({
    name: 'category',
    type: 'list',
    message: 'Select category to filter by:',
    choices: Object.values(Category),
  });

  const filteredContacts = contacts.filter(contact => contact.category === category);

  if (filteredContacts.length === 0) {
    console.log('No contacts found in this category.');
  } else {
    console.table(filteredContacts);
  }
}


// Function to search contacts by name or email
export async function searchContacts() {
  const contacts = loadContacts();
const { searchTerm } = await inquirer.prompt({
    name: 'searchTerm',
    type: 'input',
    message: 'Enter name or email to search for:',
  });

  const searchResults = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (searchResults.length === 0) {
    console.log('No contacts found!');
  } else {
    console.table(searchResults);
  }
}
