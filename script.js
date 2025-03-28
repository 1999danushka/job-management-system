document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    console.log('loginForm');
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    alert(result.message);
    if (response.ok) {
        window.location.href = 'home.html';
    }
});

document.getElementById('addRepairForm')?.addEventListener('submit', async (e) => {
    console.log('addRepairForm');   
    e.preventDefault();

    // Get form elements
    const imsJobNumber = document.getElementById('imsJobNumber');
    const serialNumber = document.getElementById('serialNumber');
    const assetNumber = document.getElementById('assetNumber');
    const date = document.getElementById('date');
    const problemDescription = document.getElementById('problemDescription');
    const technicianName = document.getElementById('technicianName');
    const handInDate = document.getElementById('handInDate');
    const Replaceparts = document.getElementById('Replace_parts');
    const User_EPF = document.getElementById('User_EPF');
    const Division = document.getElementById('Division');
    const Section = document.getElementById('Section');
   
    const isValidDate = (dateStr) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        const dateObj = new Date(dateStr);
        return regex.test(dateStr) && !isNaN(dateObj.getTime());
    };

    // Log to debug
    console.log({ imsJobNumber, serialNumber, assetNumber, date, problemDescription, technicianName, handInDate });

    if (!imsJobNumber || !serialNumber || !assetNumber || !date || !problemDescription || !technicianName || !handInDate ) {
        console.error('One or more form elements are missing!');
        alert('Please fill in all fields.');
        return;
    }

    if (!isValidDate(date.value) || !isValidDate(handInDate.value)) {
        alert('Please enter valid dates in the format YYYY-MM-DD (e.g., 2025-03-22)');
        return;
    }

    const repairData = {
        IMS_JOB_NUMBER: imsJobNumber.value,
        SERIAL_NUMBER: serialNumber.value,
        ASSET_NUMBER: assetNumber.value,
        DATE: date.value,
        DESCRIPTION: problemDescription.value,
        TECHNICIAN_NAME: technicianName.value,
        HAND_IN_DATE: handInDate.value,
        

    };

    console.log('Submitting data:', repairData);

    try {
        const response = await fetch('http://localhost:5000/add-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(repairData)
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            window.location.href = 'home.html';
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
    }
});



document.getElementById('searchRepairForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get the IMS Job Number from the input
    const imsJobNumber = document.getElementById('imsJobNumber').value;

    // Validate the input
    if (!imsJobNumber) {
        alert('Please enter an IMS Job Number');
        return;
    }

    // Show loading message
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Searching...';

    try {
        // Send the search request to the backend
        const response = await fetch(`http://localhost:5000/search-repair?imsJobNumber=${imsJobNumber}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        // Display the results
        resultDiv.innerHTML = `
            <h3>Repair Details</h3>
            <p><strong>IMS Job Number:</strong> ${data.IMS_JOB_NUMBER}</p>
            <p><strong>Serial Number:</strong> ${data.SERIAL_NUMBER}</p>
            <p><strong>Asset Number:</strong> ${data.ASSET_NUMBER}</p>
            <p><strong>Date:</strong> ${data.DATE}</p>
            <p><strong>Description:</strong> ${data.DESCRIPTION}</p>
            <p><strong>Technician Name:</strong> ${data.TECHNICIAN_NAME}</p>
            <p><strong>Hand-in Date:</strong> ${data.HAND_IN_DATE}</p>    
        `;
    } catch (error) {
        // Handle any errors
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});


document.getElementById('updateRepairForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get values from form
    const imsJobNumber = document.getElementById('imsJobNumber').value;
    const serialNumber = document.getElementById('serialNumber');
    const assetNumber = document.getElementById('assetNumber').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    // Validate that fields are not empty
    if (!imsJobNumber || !assetNumber || !description || !date) {
        alert('Please fill in all fields');
        return;
    }

    // Show loading message
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Updating...';

    try {
        // Send the update request to the backend
        const response = await fetch('http://localhost:5000/update-repair', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imsJobNumber,
                description,
                assetNumber,
                date
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        // Display success message
        resultDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
    } catch (error) {
        // Handle errors
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});
// Search Repair Record
document.getElementById('searchRepairForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const imsJobNumber = document.getElementById('searchImsJobNumber').value.trim();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!imsJobNumber) {
        alert('Please enter an IMS Job Number');
        return;
    }

    resultsDiv.innerHTML = 'Searching...';

    try {
        const response = await fetch(`http://localhost:5000/search-repair?imsJobNumber=${encodeURIComponent(imsJobNumber)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Repair not found');
        }

        // Display the found record
        resultsDiv.innerHTML = `
            <h3>Repair Found</h3>
            <p><strong>IMS Job Number:</strong> ${data.IMS_JOB_NUMBER || 'N/A'}</p>
            <p><strong>Serial Number:</strong> ${data.SERIAL_NUMBER || 'N/A'}</p>
            <p><strong>Asset Number:</strong> ${data.ASSET_NUMBER || 'N/A'}</p>
            <p><strong> Replace Parts and Description:</strong> ${data.DESCRIPTION || 'N/A'}</p>
            <p><strong>Date:</strong> ${data.DATE ? new Date(data.DATE).toLocaleDateString() : 'N/A'}</p>
            <button onclick="fillUpdateForm('${data.IMS_JOB_NUMBER}')">Edit This Record</button>
        `;

    } catch (error) {
        resultsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

// Function to fill the update form with searched data
window.fillUpdateForm = async (imsJobNumber) => {
    try {
        const response = await fetch(`http://localhost:5000/search-repair?imsJobNumber=${encodeURIComponent(imsJobNumber)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to load record');
        }

        // Pre-fill the update form
        document.getElementById('imsJobNumber').value = data.IMS_JOB_NUMBER || '';
        document.getElementById('serialNumber').value = data.SERIAL_NUMBER || '';
        document.getElementById('assetNumber').value = data.ASSET_NUMBER || '';
        document.getElementById('Replace Parts and description').value = data.DESCRIPTION || '';
        
        // Format date for the date input field
        if (data.DATE) {
            const dateObj = new Date(data.DATE);
            const formattedDate = dateObj.toISOString().split('T')[0];
            document.getElementById('date').value = formattedDate;
        }

        // Scroll to the update form
        document.getElementById('updateRepairForm').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
};