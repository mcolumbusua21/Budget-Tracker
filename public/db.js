
let db;
let budgetVersion;

const request = indexedDB.open('budget', budgetVersion || 21);

request.onupgradeneeded = function (e) {
    console.log('upgrade needed');

    const { oldVersion } = e;
    const newVersion = e.newVersion || db.version;

    console.log(`db Updated version ${oldVersion} to ${newVersion}`);
    
    db = e.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {autoIncrement: true });
    }
};

request.onerror = function (e) {
    console.log(`Woops! ${e.target.errorCode}`);
};

function checkDatabase() {
    let transaction = db.transaction(['BudgetStore'],
    'readwrite');

    const store = transaction.objectStore('BudgetStore');

    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result. length > 0) {
            fetch('api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*', 'Content-type': 'application/json'
                },
            })
            .then((response) => response.json())
            .then((res) => {
                if (res.length !== 0) {
                    transaction = db.transaction(["BudgetStore"], 'readwrite');

                    const currentStore = transaction.objectStore('BudgetStore');

                    currentStore.clear();
                }
            });
        }
    }
}
request.onsuccess = function (e) {
    console.log('success');
    db = e.target.result;
  
    // Check if app is online before reading from db
    if (navigator.onLine) {
      console.log('Backend online! 🗄️');
      checkDatabase();
    }
  };
  
  const saveRecord = (record) => {
    console.log('Save record invoked');
    // Create a transaction on the BudgetStore db with readwrite access
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
  
    // Access your BudgetStore object store
    const store = transaction.objectStore('BudgetStore');
  
    // Add record to your store with add method.
    store.add(record);
  };
  
  // Listen for app coming back online
  window.addEventListener('online', checkDatabase);
  