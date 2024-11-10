let retrievedFileUrl = ''; // Store the retrieved file URL

async function retrieveFileByUrl() {
    const apiUrl = document.getElementById('api-url').value;
    document.getElementById('status-message').textContent = 'Retrieving file...';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to retrieve file. Status: ${response.status}. Response: ${errorText}`);
        }

        const blob = await response.blob();
        retrievedFileUrl = URL.createObjectURL(blob); // Store the file URL for later use
        const contentType = response.headers.get('content-type');

        // Show the "View" button
        document.getElementById('view-button').style.display = 'block';

        // Optionally, you could also display a message or link to download
        const downloadLink = document.getElementById('download-link-url');
        downloadLink.href = retrievedFileUrl;
        downloadLink.download = 'downloadedFile'; // Default name
        downloadLink.style.display = 'inline-block';
        downloadLink.textContent = 'Download File';

        document.getElementById('status-message').textContent = 'File retrieved successfully.';
    } catch (error) {
        console.error('Error retrieving file:', error);
        document.getElementById('status-message').textContent = 'Error retrieving file.';
    }
}

function viewFile() {
    if (retrievedFileUrl) {
        // Open a new window or navigate to a new page to view the file
        const newWindow = window.open();
        newWindow.document.write(`
       <html>
    <head>
        <title>View File</title>
        <style>
            /* Circle Backgrounds */
            .circle {
                position: fixed;
                top: 90%;
                left: 90%;
                width: 700px;
                height: 700px;
                background-color: rgba(0, 255, 0, 0.35);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .circle1 {
                position: fixed;
                top: 110%;
                left: 65%;
                width: 400px;
                height: 400px;
                background-color: rgba(0, 255, 0, 0.55);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .circle2 {
                position: fixed;
                top: 70%;
                left: 50%;
                width: 150px;
                height: 150px;
                background-color: rgba(0, 255, 0, 0.45);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .circle3 {
                position: fixed;
                top: 70%;
                left: 19%;
                width: 100px;
                height: 100px;
                background-color: rgba(0, 255, 0, 0.35);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }

            /* Body & Layout */
            body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                background: radial-gradient(circle, #1c1c22, #1c1c22);
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 150vh;
                overflow-y: auto;
            }
            h1 {
                color: #007bff;
                text-align: center;
                margin: 20px 0;
            }
            p {
                font-size: 16px;
                text-align: center;
            }

            /* Navbar Styling */
            .navbar {
                width: 100%;
                background-color: #333;
                padding: 10px 20px;
                text-align: center;
                position:fixed;
            }
            .navbar h1 {
                color: #fff;
                font-size: 24px;
                margin: 0;
                font-weight: bold;
            }
            .navbar .text-white {
                color: #28a745;
            }

            /* Download Link Button */
            a {
                display: inline-block;
                padding: 10px 20px;
                margin: 10px 0;
                font-size: 16px;
                color: #fff;
                background-color: #28a745;
                text-decoration: none;
                border-radius: 5px;
                text-align: center;
            }
            a:hover {
                background-color: #218838;
            }

            /* iFrame */
            iframe {
                width: 90%;
                height: 600px;
                border: 1px solid #ccc;
                margin-top: 80px;
            }
        </style>
    </head>
    
    <body>
        <!-- Circle Backgrounds -->
        <div class="circle"></div>
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>

        <!-- Responsive Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light">
            <h1 class="navbar-brand">Commite <span class="text-white">Nexus</span> - File View</h1>
        </nav>

        
        <iframe src="${retrievedFileUrl}" frameborder="0"></iframe>
        <a href="${retrievedFileUrl}" target="_blank">Download File</a>
        <br>
    </body>
</html>


        `);
        newWindow.document.close();
    } else {
        alert('No file retrieved yet.');
    }
}
let retrievedFileUrlCode = ''; // Store the retrieved file URL for code

async function retrieveFileByCode() {
    const fileCode = document.getElementById('file-code').value;
    const fullUrl = `http://127.0.0.1:3002/api/files/file/code/${fileCode}`;
    document.getElementById('status-message').textContent = 'Retrieving file...';

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Fetch Error - Status:', response.status, 'Response:', errorText);
            throw new Error(`Failed to retrieve file. Status: ${response.status}. Response: ${errorText}`);
        }

        const data = await response.json();
        retrievedFileUrlCode = data.file.filePath; // Store the file path
        const downloadLink = document.getElementById('download-link-code');
        
        const filename = data.file.filename || retrievedFileUrlCode.split('/').pop() || 'downloadedFile';
        downloadLink.href = retrievedFileUrlCode;
        downloadLink.download = filename; // Set the filename for the download
        downloadLink.style.display = 'inline-block';
        downloadLink.textContent = 'Download File';

        // Show the "View" button
        document.getElementById('view-button-code').style.display = 'block';
        document.getElementById('status-message').textContent = 'File ready for download.';
    } catch (error) {
        console.error('Error retrieving file:', error);
        document.getElementById('status-message').textContent = 'Error retrieving file.';
    }
}
function viewFileCode() {
    if (retrievedFileUrlCode) {
        // Open a new window to view the file
        const newWindow = window.open();
        newWindow.document.write(`
       <html>
    <head>
        <title>View File</title>
        <style>
            /* Circle Backgrounds */
            .circle {
                position: fixed;
                top: 90%;
                left: 90%;
                width: 700px;
                height: 700px;
                background-color: rgba(0, 255, 0, 0.35);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .circle1 {
                position: fixed;
                top: 110%;
                left: 65%;
                width: 400px;
                height: 400px;
                background-color: rgba(0, 255, 0, 0.55);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .circle2 {
                position: fixed;
                top: 70%;
                left: 50%;
                width: 150px;
                height: 150px;
                background-color: rgba(0, 255, 0, 0.45);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .circle3 {
                position: fixed;
                top: 70%;
                left: 19%;
                width: 100px;
                height: 100px;
                background-color: rgba(0, 255, 0, 0.35);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }

            /* Body & Layout */
            body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                background: radial-gradient(circle, #1c1c22, #1c1c22);
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 150vh;
                overflow-y: auto;
            }
            h1 {
                color: #007bff;
                text-align: center;
                margin: 20px 0;
            }
            p {
                font-size: 16px;
                text-align: center;
            }

            /* Navbar Styling */
            .navbar {
                width: 100%;
                background-color: #333;
                padding: 10px 20px;
                text-align: center;
                position:fixed;
            }
            .navbar h1 {
                color: #fff;
                font-size: 24px;
                margin: 0;
                font-weight: bold;
            }
            .navbar .text-white {
                color: #28a745;
            }

            /* Download Link Button */
            a {
                display: inline-block;
                padding: 10px 20px;
                margin: 10px 0;
                font-size: 16px;
                color: #fff;
                background-color: #28a745;
                text-decoration: none;
                border-radius: 5px;
                text-align: center;
            }
            a:hover {
                background-color: #218838;
            }

            /* iFrame */
            iframe {
                width: 90%;
                height: 600px;
                border: 1px solid #ccc;
                margin-top: 150px;
            }
        </style>
    </head>
    
    <body>
        <!-- Circle Backgrounds -->
        <div class="circle"></div>
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>

        <!-- Responsive Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light">
            <h1 class="navbar-brand">Commite <span class="text-white">Nexus</span> - File View</h1>
        </nav>

        
        <iframe src="${retrievedFileUrlCode}" frameborder="0"></iframe>
        <a href="${retrievedFileUrlCode}" target="_blank">Download File</a>
        <br>
    </body>
</html>

        `);
        newWindow.document.close();
    } else {
        alert('No file retrieved yet.');
    }
}


function decodeQRCode() {
    const fileInput = document.getElementById('qr-input');
    const canvas = document.getElementById('qr-canvas');
    const context = canvas.getContext('2d');
    const resultContainer = document.getElementById('decoded-result');

    // Clear previous results
    resultContainer.textContent = '';

    if (fileInput.files.length === 0) {
        resultContainer.textContent = 'Please upload a QR code image.';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Set canvas dimensions based on the uploaded image
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                const qrContent = code.data;
                const urlPattern = /^(https?:\/\/[^\s]+)/;
                const match = qrContent.match(urlPattern);

                if (match) {
                    const url = match[0];
                    resultContainer.innerHTML = `<strong>Decoded URL:</strong> <a href="${url}" target="_blank">${url}</a>`;
                    
                    // Show the "View" button
                    const viewButton = document.getElementById('view-button-qr');
                    viewButton.style.display = 'block'; // Show the button

                    // Optional: Automatically initiate file retrieval if applicable
                    retrieveFileByUrl(url);  // Ensure this function is defined in your context
                } else {
                    resultContainer.innerHTML = `Decoded Data: ${qrContent}`;
                }
            } else {
                resultContainer.innerHTML = 'No QR code found. Please try again with a clear image.';
                document.getElementById('view-button-qr').style.display = 'none'; // Hide the button if no code is found
            }
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}
