import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BASE_URL } from '../constants';

/**
 * Helper function to handle API requests
 * @param {string} url - The endpoint URL
 * @param {string} method - The HTTP method (default is 'GET')
 * @param {object} data - The request payload (default is an empty object)
 * @param {object} headers - Additional request headers (default is an empty object)
 * @returns {Promise<object>} - The response data
 */
const apiCall = async (url, method = 'GET', data = {}, headers = {}) => {
    try {
        const response = await axios({
            url: `${BASE_URL}${url}`,
            method,
            data,
            headers,
        });
        return response.data;
    } catch (error) {
        console.error(`Error during ${method} request to ${url}:`, error);
        throw error;
    }
};

/**
 * Select an image from the device's library
 * @param {Function} setImageUri - Callback function to set the image URI
 */
export const selectImage = async (setImageUri) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        setImageUri(result.assets[0].uri);
    }
};

/**
 * Upload the selected image to the server
 * @param {string} imageUri - URI of the selected image
 * @param {Function} setUploadedImageUrl - Callback function to set the uploaded image URL
 * @param {Function} detectDisease - Function to call for disease detection
 * @param {Function} setDiseaseResult - Callback function to set the disease result
 */
export const uploadImage = async (imageUri, setUploadedImageUrl, detectDisease, setDiseaseResult) => {
    if (!imageUri) return;

    const formData = new FormData();
    formData.append('image', {
        uri: imageUri,
        name: 'plant.jpg',
        type: 'image/jpeg'
    });

    try {
        const uploadResponse = await axios.post(`${BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const imageUrl = uploadResponse.data.imageUrl;
        setUploadedImageUrl(imageUrl);
        detectDisease(imageUrl, setDiseaseResult);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

/**
 * Send the image URL to the AI model to detect disease
 * @param {string} imageUrl - URL of the uploaded image
 * @param {Function} setDiseaseResult - Callback function to set the disease result
 */
export const detectDisease = async (imageUrl, setDiseaseResult) => {
    try {
        const detectionResponse = await axios.post(`${BASE_URL}/detect`, { imageUrl });

        const diseaseInfo = detectionResponse.data.disease;
        setDiseaseResult(diseaseInfo);
    } catch (error) {
        console.error('Error detecting disease:', error);
    }
};


/**
 * Fetch all products (agrochemicals)
 * @returns {Promise<object[]>} - The list of products
 */
export const getAllProducts = () => apiCall('/products');

/**
 * Buy a chemical
 * @param {string} chemicalId - The ID of the chemical to buy
 * @param {string} userId - The ID of the user making the purchase
 * @param {number} quantity - The quantity of the chemical to buy
 * @returns {Promise<object>} - The purchase confirmation
 */
export const buyChemical = (chemicalId, userId, quantity) =>
    apiCall('/buyChemical', 'POST', { chemicalId, userId, quantity });

/**
 * Get notifications for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<object[]>} - The list of notifications
 */
export const getNotifications = (userId) =>
    apiCall(`/notifications?userId=${userId}`);

/**
 * Search for a product by query
 * @param {string} query - The search query
 * @returns {Promise<object[]>} - The search results
 */
export const searchProduct = (query) =>
    apiCall(`/searchProduct?query=${query}`);

/**
 * Log in a user
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<object>} - The user's data and token
 */
export const loginUser = (email, password) =>
    apiCall('/login', 'POST', { email, password });

/**
 * Register a new user
 * @param {object} userData - The user's registration data
 * @returns {Promise<object>} - The new user's data
 */
export const registerNewUser = (userData) =>
    apiCall('/register', 'POST', userData);

/**
 * Send an OTP to a phone number
 * @param {string} phoneNumber - The phone number to send the OTP to
 * @returns {Promise<object>} - The OTP sending confirmation
 */
export const sendOTP = (phoneNumber) =>
    apiCall('/sendOTP', 'POST', { phoneNumber });

/**
 * Validate an OTP for a phone number
 * @param {string} phoneNumber - The phone number to validate the OTP for
 * @param {string} otp - The OTP to validate
 * @returns {Promise<object>} - The OTP validation result
 */
export const validateOTP = (phoneNumber, otp) =>
    apiCall('/validateOTP', 'POST', { phoneNumber, otp });

/**
 * Fetch all products along with their associated shop information
 * @returns {Promise<object[]>} - The list of products with shop information
 */
export const getAllProductsWithShop = () => apiCall('/productsWithShop');

/**
 * View all shops owned by a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<object[]>} - The list of shops owned by the user
 */
export const viewAllMyShops = (userId) =>
    apiCall(`/myShops?userId=${userId}`);

/**
 * View all shops
 * @returns {Promise<object[]>} - The list of all shops
 */
export const viewAllShops = () => apiCall('/shops');

/**
 * View all diseases
 * @returns {Promise<object[]>} - The list of all diseases
 */
export const viewAllDiseases = () => apiCall('/diseases');

/**
 * View all categories
 * @returns {Promise<object[]>} - The list of all categories
 */
export const viewAllCategories = () => apiCall('/categories');
