import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BASE_URL } from '../constants';

/**
 * Helper function to handle API requests
 * @param {string} url - The endpoint URL
 * @param {string} method - The HTTP method (default is 'GET')
 * @param {object} data - The request payload (default is an empty object)
 * @param {object} headers - Additional request headers (default is an empty object)
 * @param {string} accessToken - optionally pass the access token
 * @returns {Promise<object>} - The response data
 */
const apiCall = async (url, method = 'GET', data = {}, headers = {}, accessToken = '') => {
    try {
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await axios({
            url: `${BASE_URL}${url}`,
            method: method,
            data,
            headers,
        });
        // console.log("the response from ", url, " is ", response.data[0]);
        return response.data[0];
    } catch (error) {
        console.error(`Error during ${method} request to ${BASE_URL}${url}:`, response.error);
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
export const getAllProducts = () => apiCall('products-mng/view-product');

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
    apiCall('auth/login', 'POST', { email, password });

/**
 * Register a new user
 * @param {object} userData - The user's registration data
 * @returns {Promise<object>} - The new user's data
 */
export const registerNewUser = (userData) =>
    apiCall('auth/register', 'POST', userData);

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
export const validateOTP = async (phoneNumber, code) => {
    const url = `${BASE_URL}auth/verify-otp`;
  
    try {
      const response = await axios.post(url, {
        phoneNumber: phoneNumber,
        code: code,
      });
  
      if (response.status === 201) {
        console.log("OTP validation successful:", response.data);
        return response.data; // Return success message 
      } else {
        throw new Error("OTP validation failed");
      }
    } catch (error) {
      // Axios errors (e.g., network error, timeout)
      console.error("Error validating OTP:", error.response.data.message);
      throw error;
    }
  };

  export const sendNotification = async (notificationData, accessToken) => {
    const apiUrl = `${BASE_URL}notification-mng/create-notification`;

    try {
        const response = await axios.post(apiUrl, notificationData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        console.log("API Response:", response.data);

        if (response.data.status !== "success") {
            throw new Error('Failed to send notification');
        }

        return response.data;
    } catch (error) {
        console.error('sendNotification Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};
/**
 * Fetch all products along with their associated shop information
 * @returns {Promise<object[]>} - The list of products with shop information
 */
// export const getAllProductsWithShop = (shopId) => apiCall(`shop-mng/single-shop`, 'POST', { shopId });
export const getAllProductsWithShop = async (shopId) => {
    const url = `${BASE_URL}shop-mng/single-shop`;
    try {
        const response = await axios.post(url, { shopId });
        console.log(`API Response for ${url}:`, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error(`Error ${error.response.status} during POST request to ${url}:`, error.response.message);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(`No response received from POST request to ${url}:`, error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.error(`Error setting up POST request to ${url}:`, error.message);
        }
        throw error;
    }
};

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
export const viewAllShops = () => apiCall('shop-mng/all-shops');

/**
 * View all diseases
 * @returns {Promise<object[]>} - The list of all diseases
 */
export const viewAllDiseases = () => apiCall('/diseases');

/**
 * View all categories
 * @returns {Promise<object[]>} - The list of all categories
 */
export const viewAllCategories = () => apiCall('category-mng/view-category');

/**
 * Send notification to shop owner when a chemical is purchased
 * @param {object} shop - The shop information
 * @param {number} totalPrice - The total price of the purchase
 * @param {string} token - The access token for authentication
 * @returns {Promise<object>} - The notification sending confirmation
 */
const sendNotificationToShopOwner = async (shop, totalPrice, token) => {
    try {
        const notificationData = {
            shopId: shop.id,
            productId: shop.productId, // Adjust according to your data structure
            quantity: shop.quantity,
            totalPrice,
            userLocation: shop.userLocation,
            notificationChannel: 'SMS', // Assuming SMS notification
            notificationType: 'EXTERNAL',
            imageUrl: 'https://placehold.co/400', // Placeholder image URL
        };

        const response = await apiCall('/sendNotificationToShopOwner', 'POST', notificationData, { Authorization: `Bearer ${token}` });
        return response;
    } catch (error) {
        console.error('Error sending notification to shop owner:', error);
        throw error;
    }
};



export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}products-mng/single-product/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', response.error.message);
        throw error;
    }
};


