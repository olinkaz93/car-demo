// Define the search upon a sumbission and prevent refresh the page // 
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    performSearch();
});

// Define the search upon change a display type // 
document.getElementById('display-type').addEventListener('change', function() {
    performSearch();
});

// Hide the result container when page is loaded to hide it before search // 
document.getElementById('result').style.display = 'none';

// Function to be called when search is executed // 
function performSearch() {
    const carId = document.getElementById('car_id').value.trim();
    let carData;
    let brandData;

    if (!carId) {
        displayError('Please enter a Car ID');
        return;
    }

    fetch(`/cars/${carId}`)
        .then(response => {
            if (response.status === 404) {
                throw new Error('Car not found! :(');
            }
            return response.json();
        })
        .then(data => {
            carData = data; // Store the car data for later use
            const brandId = carData.brandId;
            return fetch(`/brands/${brandId}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Brand not found');
            }
            return response.json();
        })
        .then(data => {
            brandData = data; // Store the brand data for later use
            const companyId = brandData.companyId;
            return fetch(`/companies/${companyId}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Company not found');
            }
            return response.json();
        })
        .then(companyData => {
            const combinedData = {
                car: carData,
                brand: brandData,
                company: companyData
            };
            sessionStorage.setItem('resultData', JSON.stringify(combinedData));
            displayResult(combinedData);
        })
        .catch(error => {
            console.error(error); // Log the error in the console
            displayError(error.message);
        });
}

function displayResult(data) {
    const displayType = document.getElementById('display-type').value;
    const resultDiv = document.getElementById('result');
    let resultString;

    if (displayType === 'json') {
        resultString = JSON.stringify(data, null, 2);
    } else if (displayType === 'string') {
        if (!data.car || !data.brand || !data.company || !data.car.id) {
            displayError('No result found');
            return;
        }
        resultString = `You have found a car!\n\nCar ID: ${data.car.id}, Model: ${data.car.model}, Brand Name: ${data.brand.name} and Company Name: ${data.company.name}`;
    } else {
        displayError('Invalid display type');
        return;
    }

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<pre>${resultString}</pre>`;
}

function displayError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<p>${message}</p>`;
}
