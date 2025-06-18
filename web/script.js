/**
 * Brain Tumor Detection Web Application
 * 
 * This application allows users to:
 * 1. Upload brain MRI images for tumor detection
 * 2. Get predictions using the AI model
 * 3. View results with tumor segmentation
 * 4. Download prediction results
 * 5. View random test images
 * 
 * How to use:
 * - Click "Choose File" to select a brain MRI image
 * - Click "Predict" to get the tumor detection result
 * - Click "Get Random Test Image" to test with a sample image
 * - Click on the result image to view in fullscreen
 * - Click "Download Result" to save the prediction
 */

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const predictBtn = document.getElementById('predictBtn');
    const randomBtn = document.getElementById('randomBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const resultImage = document.getElementById('resultImage');
    const previewImage = document.getElementById('previewImage');
    const fullscreenView = document.getElementById('fullscreen-view');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeFullscreen = document.getElementById('closeFullscreen');
    const downloadBtn = document.querySelector('.download-btn');

    // Handle image preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle fullscreen view
    resultImage.addEventListener('click', () => {
        fullscreenImage.src = resultImage.src;
        fullscreenView.classList.remove('hidden');
    });

    closeFullscreen.addEventListener('click', () => {
        fullscreenView.classList.add('hidden');
    });

    // Handle download
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = resultImage.src;
        link.download = 'prediction_result.png';
        link.click();
    });

    async function predictImage(file) {
        // Show loading
        loading.classList.remove('hidden');
        result.classList.add('hidden');
        fullscreenView.classList.add('hidden');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Get image prediction
            const imageResponse = await fetch('/api/predict', {
                method: 'POST',
                body: formData,
                mode: 'cors',
                headers: {
                    'Accept': 'image/png',
                },
                credentials: 'omit'
            });

            if (!imageResponse.ok) {
                throw new Error('Image prediction failed');
            }

            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            resultImage.src = imageUrl;

            // Get text prediction
            const textFormData = new FormData();
            textFormData.append('file', file);
            const textResponse = await fetch('/api/predict-text', {
                method: 'POST',
                body: textFormData,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'omit'
            });

            if (!textResponse.ok) {
                throw new Error('Text prediction failed');
            }

            const textData = await textResponse.json();
            document.getElementById('predictionText').textContent = textData.prediction;
            
            result.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        } finally {
            loading.classList.add('hidden');
        }
    }

    predictBtn.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }
        await predictImage(file);
    });

    randomBtn.addEventListener('click', async () => {
        try {
            loading.classList.remove('hidden');
            // Add timestamp to prevent caching
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/get-random-image?t=${timestamp}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get random image');
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            // Show preview of random image
            previewImage.src = imageUrl;
            
            // Create a File object from the blob
            const file = new File([blob], `random_image_${timestamp}.jpg`, { type: 'image/jpeg' });
            
            // Set the file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
            
            // Trigger prediction
            await predictImage(file);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        } finally {
            loading.classList.add('hidden');
        }
    });
});
