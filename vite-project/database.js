import { openDB } from "idb";
if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB.");
   
  }

export const database = openDB('comments', 1, {
  upgrade(db){
    console.log('Creating a new object store.');
    if (!db.objectStoreNames.contains('comment')) {
      const commentOS = db.createObjectStore('comment', {  keyPath:"id", autoIncrement: true });
      commentOS.createIndex('name', 'name', { unique: false })
      }
  }
 
  
});