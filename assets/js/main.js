function fetchCountries() {
  fetch("https://free.currencyconverterapi.com/api/v5/currencies")
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .then(res => {
      const { results } = res;
      updateCountries(results, "from");
      updateCountries(results, "to");
    });
}

function updateCountries(results, selectID) {
  let select = document.getElementById(selectID);
  for (const val in results) {
    let option = document.createElement("option");
    let text = document.createTextNode(results[val].currencyName);
    let value = document.createAttribute("value");
    value.value = val;
    option.setAttributeNode(value);
    option.appendChild(text);
    select.appendChild(option);
  }
  select.parentElement.className = "select is-rounded";
}

const form = document.getElementById("form__converter");
form.addEventListener("submit", convertCurrency);

function convertCurrency(e) {
  e.preventDefault();
  document.getElementById("answer").value = "";
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const amount = parseInt(document.getElementById("useramount").value);
  const key = `${from}_${to}`;
  if (!!amount) {
    fetch(
      `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=y`
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(resp => {
        const conversionValue = resp[`${from}_${to}`]["val"];
        const answer = conversionValue * amount;
        document.querySelector("#answer").textContent = `${to} ${answer.toFixed(
          2
        )}`;
        addConvert("convert", conversionValue, key);
      })
      .catch(() => {
        getDataByKey("convert", key).then(res => {
          console.log(res);
          document.querySelector("#answer").textContent = res * amount;
        });
        console.log();
      });
  }
}

fetchCountries();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

const dbPromise = idb.open("conversion-store", 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore("convert");
  }
});

function addConvert(store, data, key) {
  dbPromise.then(db => {
    const tx = db.transaction(store, "readwrite");
    const st = tx.objectStore(store);
    st.put(data, key);
    return tx.complete;
  });
}

function getDataByKey(store, key) {
  return dbPromise.then(db => {
    return db
      .transaction(store)
      .objectStore(store)
      .get(key);
  });
}
