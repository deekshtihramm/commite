// Function to handle file upload, retrieve QR code, and display it
async function showFileNameAndQRCode() {
    const input = document.getElementById('file-upload');
    const file = input.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        // Show loading indicator
        document.getElementById('loading-indicator').style.display = 'block';

        try {
            // Make a request to upload the file
            const response = await fetch('http://127.0.0.1:3002/api/files/upload', {
                method: 'POST',
                body: formData,
                mode: 'cors' // Ensure CORS is enabled on the backend
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const data = await response.json(); // Parse the JSON response

            // Update the file name and show it
            document.getElementById('file-name').textContent = `Uploaded File: ${file.name}`;

            // To show the cancel button
            document.getElementById('cancel-button').style.display = 'block'; // Makes the button visible

            // Replace the current image with the QR code if the URL is returned
            if (data.qrCodeUrl) {
                const qrCodeImage = document.getElementById('uploaded-image');
                qrCodeImage.src = data.qrCodeUrl;
                qrCodeImage.alt = 'Generated QR Code';
                qrCodeImage.style.display = 'block'; // Show the image
            
                // Display the file URL in the text input
                document.getElementById('file-url').value = data.fileUrl;
                document.getElementById('file-url').style.display = 'block'; // Show the file URL input
            
                document.getElementById('qr-url').value = data.qrCodeUrl; // Set the QR code URL
                document.getElementById('qr-url').style.display = 'block'; // Show the QR code URL input
            
                // Show the unique 4-character code on the frontend
                document.getElementById('file-code').textContent = `File Code: ${data.filecode}`;
            
                // Show the copy button
                document.querySelector('.copy-button').style.display = 'block';
            }

        } catch (error) {
            console.error('Error during file upload:', error);
            alert('File upload failed. Please try again.'); // Updated alert message
        } finally {
            document.getElementById('loading-indicator').style.display = 'none';
        }
    } else {
        alert('Please select a file.');
    }
}

// Copy URL to clipboard using the Clipboard API
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

async function copyURL() {
    const fileURL = document.getElementById('file-url').value.trim(); // Ensure this gets the correct value
    if (!fileURL) {
        alert('Please enter a URL to copy.');
        return;
    }

    try {
        await navigator.clipboard.writeText(fileURL);
        showToast("QR Code URL copied to clipboard!");
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy the URL. Please try again.');
    }
}

// Reset upload form
function resetUpload() {
    document.getElementById('file-upload').value = ""; // Reset the file input
    document.getElementById('file-name').textContent = "No file chosen"; // Reset file name
    document.getElementById('qrcode').style.display = 'none'; // Hide the QR code
    document.getElementById('file-url').value = ""; // Clear the URL input
    document.getElementById('file-code').textContent = ""; // Clear the file code
    document.querySelector('.copy-button').style.display = 'none'; // Hide the copy button

    // Restore the original upload image after reset
    const originalImage = "C:\\Users\\Deepak\\Downloads\\upload (1).png"; // Use the relative path to your project
    const qrCodeImage = document.getElementById('uploaded-image');
    qrCodeImage.src = originalImage; // Reset image to the original upload image
    qrCodeImage.alt = 'Uploaded Image'; // Reset alt text
}
