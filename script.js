const searchBtn = document.getElementById("search-btn");
const countryInput = document.getElementById("country-input");
const countryInfo = document.getElementById("country-info");
const borderGrid = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");
const spinner = document.getElementById("loading-spinner");

async function searchCountry(countryName) {
try {
spinner.classList.remove("hidden");
errorMessage.textContent = "";
countryInfo.innerHTML = "";
borderGrid.innerHTML = "";

const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
if (!response.ok) throw new Error("Country not found");

const data = await response.json();
const country = data[0];

// Main country info (matches example format)
document.getElementById("country-info").innerHTML = `
<h2>${country.name.common}</h2>
<p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
<p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
<p><strong>Region:</strong> ${country.region}</p>
<img src="${country.flags.svg}" alt="${country.name.common} flag" width="100">
`;

// Border countries (name + flag)
if (country.borders) {
for (let code of country.borders) {
const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
const borderData = await borderResponse.json();
const neighbor = borderData[0];

borderGrid.innerHTML += `
<div>
<p>${neighbor.name.common}</p>
<img src="${neighbor.flags.svg}" width="60">
</div>
`;
}
}

} catch (error) {
document.getElementById("error-message").textContent = "Country not found.";
} finally {
spinner.classList.add("hidden");
}
}

// Click trigger
searchBtn.addEventListener("click", () => {
const country = countryInput.value.trim();
if (country) {
searchCountry(country);
}
});