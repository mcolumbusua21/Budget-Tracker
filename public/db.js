let db;
let budgetVersion;

const request = indexDB.open('budgetdb' budgetVersion || 21);

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
