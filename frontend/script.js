function downloadFile() {
    const downloadUrlApi = `http://127.0.0.1:3002/api/download`; // Make sure the path matches the route in the backend
    window.location.href = downloadUrlApi; 
}

function aboutFile() {
    const downloadUrlApi = `http://127.0.0.1:3002/api/about`; // Make sure the path matches the route in the backend
    window.location.href = downloadUrlApi; 
}

function contactFile() {
    const downloadUrlApi = `http://127.0.0.1:3002/api/contact`; // Make sure the path matches the route in the backend
    window.location.href = downloadUrlApi; 
}

function indexFile() {
    const downloadUrlApi = `http://127.0.0.1:3002/api/index`; // Make sure the path matches the route in the backend
    window.location.href = downloadUrlApi; 
}

async function shareQRCodeImage() {
    const qrImage = document.getElementById("uploaded-image");

    if (qrImage && qrImage.src && navigator.share) {
        try {
            // Fetch the image as a blob
            const response = await fetch(qrImage.src);
            const blob = await response.blob();
            const file = new File([blob], "QRCode.png", { type: "image/png" });

            // Additional data you want to share
            const additionalText = "Here is your QR code along with some extra information.";
            const fileUrl = document.getElementById("file-name3").value; // Assuming you have a file URL in an input

            // Use the Web Share API to share the image and additional data
            await navigator.share({
                files: [file],
                title: "QR Code",
                text: `${additionalText}\nFile URL: ${fileUrl}`,
            });
            console.log("QR code and additional data shared successfully.");
        } catch (error) {
            console.error("Error sharing QR code and additional data:", error);
        }
    } else {
        alert("QR code not generated or sharing not supported on this browser.");
    }
}

function shareFile() {
    const fileURL = document.getElementById('file-url').value; // Assuming this is where the file URL is stored
    const fileName = document.getElementById('file-name3').innerText; // Assuming the file name is in this element
    const filecode = document.getElementById('file-code').value;

    if (navigator.share) {
        navigator.share({
            title: 'Check out this file!',
            text: `File Name: ${fileName}`,
            url: fileURL,
            code: filecode,
        })
        .then(() => console.log('Share successful'))
        .catch((error) => console.log('Share failed', error));
    } else {
        // Fallback for browsers that do not support the share API
        alert('Sharing is not supported on this device or browser.');
    }
}

function shareViaEmail() {
    const fileURL = document.getElementById('file-url').value; // Get the file URL
    const fileName = document.getElementById('file-name').innerText; // Get the file name
    const filecode = document.getElementsById('file-code').innerText;
    const subject = encodeURIComponent('Check out this file!');
    const body = encodeURIComponent(`File Name: ${fileName}\nLink: ${fileURL} \n ${filecode}`);

    // Create a mailto link
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink; // Open the default email client
}

function shareOnFacebook() {
    const fileURL = document.getElementById('file-url').value; // Assuming this is where the file URL is stored
    const fileName = document.getElementById('file-name').innerText; // Assuming the file name is in this element
    const filecode = document.getElementById('file-code').innerText; // Ensure consistent naming

    const text = `Check out this file!\nFile Name: ${fileName}\nFile Code: ${filecode}\nURL: ${fileURL}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fileURL)}&quote=${encodeURIComponent(text)}`, '_blank');
}

function shareOnTwitter() {
    const fileURL = document.getElementById('file-url').value; // Assuming this is where the file URL is stored
    const fileName = document.getElementById('file-name').innerText; // Assuming the file name is in this element
    const filecode = document.getElementById('file-code').innerText; // Ensure consistent naming
    const text = `Check out this file!\nFile Name: ${fileName}\nFile Code: ${filecode}\nURL: ${fileURL}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fileURL)}`, '_blank');
}

function shareOnLinkedIn() {
    const fileURL = document.getElementById('file-url').value; // Assuming this is where the file URL is stored
    const fileName = document.getElementById('file-name').innerText; // Assuming the file name is in this element
    const filecode = document.getElementById('file-code').innerText; // Ensure consistent naming

    const text = `Check out this file!\nFile Name: ${fileName}\nFile Code: ${filecode}\nURL: ${fileURL}`;
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fileURL)}&title=${encodeURIComponent(fileName)}&summary=${encodeURIComponent(text)}`, '_blank');
}

function shareOnWhatsApp() {
    const fileURL = document.getElementById('file-url').value; // Assuming this is where the file URL is stored
    const fileName = document.getElementById('file-name').innerText; // Assuming the file name is in this element
    const filecode = document.getElementById('file-code').innerText; // Ensure consistent naming

    const message = `File Name: ${fileName}\n ${filecode}\nURL: ${fileURL}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

// Function to handle file upload,u retrieve QR code, and display it
async function showFileNameAndQRCode() {
    const input = document.getElementById('file-upload');
    const file = input.files[0];

    const fileInput = document.getElementById("file-upload");
    const fileName = document.getElementById("file-name");
    const newCard = document.getElementById("new-card");
    const oldcard = document.getElementById("upload-card");

    if (fileInput.files.length > 0) {
        // Display the selected file name
        fileName.textContent = fileInput.files[0].name;

        oldcard.style.display = "none";

        // Show the second card
        newCard.style.display = "block";


    }

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        // Show loading indicator and disable input
        document.getElementById('loading-indicator').style.display = 'block';
        input.disabled = true; // Disable file input

        try {
            // Make a request to upload the file
            const response = await fetch('http://127.0.0.1:3002/api/files/upload', {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const data = await response.json();
        
            // Update the file name and show it
            const filenamew = file.name;
            document.getElementById('file-name1').textContent = `Uploaded File: ${file.name}`;
            document.getElementById('file-name3').value = filenamew;
            document.getElementById('cancel-button').style.display = 'block';

            if (data.qrCodeUrl) {
                const qrCodeImage = document.getElementById('uploaded-image');
                qrCodeImage.src = data.qrCodeUrl;
                qrCodeImage.alt = 'Generated QR Code';

                document.getElementById('file-url').value = data.fileUrl;
                document.getElementById('qr-url').value = data.qrCodeUrl;
                document.getElementById('file-code').textContent = `File Code: ${data.filecode}`;
                document.querySelector('.copy-button').style.display = 'block';
                
                document.querySelector('.url-input').style.display = 'block';

            }

        } catch (error) {
            console.error('Error during file upload:', error);
            alert('File upload failed. Please try again.');
        } finally {
            document.getElementById('loading-indicator').style.display = 'none';
            input.disabled = false; // Re-enable file input
        }
    } else {
        alert('Please select a file.');
    }
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
    }
}


// Reset upload form
function resetUpload() {
    const fileInput = document.getElementById('file-upload');
    fileInput.value = ""; 
    document.getElementById('new-card').style.display = "none";
    document.getElementById('file-name1').textContent = "none"; 
    document.getElementById('qrcode').style.display = 'none'; 
    document.getElementById('file-url').style.display = "none"; 
    document.getElementById('file-code').textContent = ""; 
    document.querySelector('.copy-button').style.display = 'none'; 
    document.querySelector('.cancel-button').style.display = 'none';
    document.getElementById('upload-card').style.display = 'block'; 

    
    // Reset the QR code image and alt text
    const qrCodeImage = document.getElementById('uploaded-image');
    qrCodeImage.src = "C:/Users/Deepak/Downloads/upload (1).png"; // Use a relative path
    qrCodeImage.alt = 'Uploaded Image';
}
