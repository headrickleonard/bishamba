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
 * Fetches disease information based on the provided ID or code.
 *
 * @param {string} idOrCode - The disease ID or code to search for.
 * @returns {Promise<Object>} - A promise that resolves to the disease data.
 * @throws {Error} - Throws an error if the request fails or the disease is not found.
 */
export async function getDiseaseData(idOrCode) {
    const BASE_URL = 'https://api.bishamba.kibuti.co.tz/api/v1/diseases-mng/single-disease';

    try {
        const response = await axios.get(BASE_URL, {
            params: { idOrCode: idOrCode },
        });

        return response.data;
    } catch (error) {
        throw new Error(`Error fetching disease data: ${error.response?.status} - ${error.response?.statusText || error.message}`);
    }
}

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
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}auth/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Login API call error:", error);
        throw error;
    }
};

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

/**
 * Uploads an image to the server and returns the URL.
 * @param {Object} image - The image file to upload.
 * @param {string} image.uri - The URI of the image file.
 * @param {string} [image.type='image/jpeg'] - The MIME type of the image file.
 * @param {string} [image.name='image.jpg'] - The name of the image file.
 * @returns {Promise<string>} A promise that resolves to the URL of the uploaded image.
 * @throws Will throw an error if the request fails.
 */
// export async function uploadImage(image) {
//     const url = `${BASE_URL}socialMedia-mng/upload`;
//     const formData = new FormData();

//     formData.append('files', {
//         uri: image.uri,
//         // type: image.type || 'image/jpeg',
//         // name: image.name || 'image.jpg',
//     });

//     try {
//         console.log('Uploading ',JSON.stringify(formData),' to:', url);

//         const response
//             = await axios.post(url, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//         if (response.data) {
//             console.log('Image uploaded successfully:', response.data.url);

//             return response.data.url;
//         } else {
//             console.error('Failed to get the image URL:', response.data);
//             throw new Error('Failed to get the image URL');
//         }
//     } catch (error) {
//         console.error('Error uploading image:', error.response ? error.response.data : error.message);
//         throw error;
//     }
// }
export const uploadImage = async (imagePath) => {
    const formData = new FormData();
    formData.append('files', {
        uri: imagePath,
        type: imagePath.type || 'image/jpeg',
        name: imagePath.name || 'image.jpg',
    });

    const options = {
        method: 'POST',
        url: `${BASE_URL}socialMedia-mng/upload`,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData
    };

    try {
        const response = await axios.request(options);
        console.log(response.data.data[0]);
        return response.data.data[0];
    } catch (error) {
        console.error('Error uploading image:', error.response);
        throw error;
    }
};
/**
 * Retrieves product details by product ID.
 * @param {string} productId - The ID of the product to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the product details.
 * @throws Will throw an error if the request fails.
 */
export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}products-mng/single-product/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        throw error;
    }
};

/**
 * Create a post with content and image URLs.
 * @param {string} accessToken - The access token for authorization.
 * @param {string} content - The content of the post.
 * @param {Array<Object>} images - The list of image objects to be uploaded.
 * @returns {Promise<Object>} - The response data from the server.
 */
export async function createPost(accessToken, content, images) {
    const url = `${BASE_URL}socialMedia-mng/posts`;

    try {
        console.log('Uploading images...');
        const imageUploadPromises = images.map((image) => uploadImage(image.uri));
        const imageUrls = await Promise.all(imageUploadPromises);
        console.log('Creating post with content:', content, 'and imageUrls:', imageUrls);
        console.log('Image URLs:', imageUrls.length);


        const options = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: {
                content: content,
                images: imageUrls,
            },
        };

        const response = await axios.request(options);
        console.log('Post created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating post::', error.response ? error.response.data : error.message);
        throw error;
    }
}

// export async function createPost(accessToken, content, images) {
//     const url = `${BASE_URL}socialMedia-mng/posts`;

//     try {
//         console.log('Uploading images...');
//         const imageUploadPromises = images.map((image) => uploadImage(image.uri));
//         const imageUrls = await Promise.all(imageUploadPromises);

//         console.log('Creating post with content:', content, 'and imageUrls:', imageUrls);

//         const response = await axios.post(url, {
//             content: content,
//             images: imageUrls,
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`,
//             },
//         });

//         console.log('Post created successfully:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error creating post:', error.response ? error.response.data : error.message);
//         throw error;
//     }
// }
/**
 * Fetches all posts from the server.
 * @returns {Promise<Object[]>} A promise that resolves to an array of post objects.
 * @throws Will throw an error if the request fails.
 */
export async function getAllPosts() {
    const url = `${BASE_URL}socialMedia-mng/posts`;

    try {
        const response = await axios.get(url);
        const responseData = response.data[0];

        if (responseData.status === 'success') {
            console.log('Posts retrieved successfully:', responseData.data);
            return responseData.data; // Correctly return the data part
        } else {
            console.error('Failed to retrieve posts:', responseData);
            return responseData; // Return an empty array in case of failure
        }
    } catch (error) {
        console.error('Error retrieving posts:', error.response ? error.response.data : error.message);
        throw error; // Re-throw error for handling in the calling function
    }
}

/**
 * Votes on a post.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} postId - The ID of the post to vote on.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function voteOnPost(accessToken, postId) {
    const url = `${BASE_URL}socialMedia-mng/posts/vote`;

    try {
        const response = await axios.post(
            url,
            { postId },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Voted on post successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error voting on post:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Retrieves all votes on a post.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function getAllVotesOnPost(postId) {
    const url = `${BASE_URL}socialMedia-mng/posts/all-votes/${postId}`;

    try {
        const response = await axios.get(url);
        console.log('Votes retrieved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving votes on post:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Retrieves all votes on a comment.
 * @param {string} commentId - The ID of the comment.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function getAllVotesOnComment(commentId) {
    const url = `${BASE_URL}socialMedia-mng/comments/all-votes/${commentId}`;

    try {
        const response = await axios.get(url);
        console.log('Votes retrieved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving votes on comment:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Votes on a comment.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} commentId - The ID of the comment to vote on.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function voteOnComment(accessToken, commentId) {
    const url = `${BASE_URL}socialMedia-mng/comments/vote`;

    try {
        const response = await axios.post(
            url,
            { commentId },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Voted on comment successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error voting on comment:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Creates a new comment on a post.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} postId - The ID of the post to comment on.
 * @param {string} content - The content of the comment.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function createComment(accessToken, postId, content) {
    const url = `${BASE_URL}socialMedia-mng/comments`;

    try {
        const response = await axios.post(
            url,
            { postId, content },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Comment created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Retrieves all comments for a post.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function getCommentsByPost(postId) {
    const url = `${BASE_URL}socialMedia-mng/post-comments/${postId}`;

    try {
        const response = await axios.get(url);
        console.log('Comments retrieved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving comments by post:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Deletes a comment.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} commentId - The ID of the comment to delete.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function deleteComment(accessToken, commentId) {
    const url = `${BASE_URL}socialMedia-mng/comments/delete/${commentId}`;

    try {
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Comment deleted successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Reports a post.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} postId - The ID of the post to report.
 * @param {string} reason - The reason for reporting the post.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function reportOnPost(accessToken, postId, reason) {
    const url = `${BASE_URL}socialMedia-mng/report/report-post`;

    try {
        const response = await axios.post(
            url,
            { reason, postId },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Post reported successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error reporting post:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Reports a comment.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} commentId - The ID of the comment to report.
 * @param {string} reason - The reason for reporting the comment.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws Will throw an error if the request fails.
 */
export async function reportOnComment(accessToken, commentId, reason) {
    const url = `${BASE_URL}socialMedia-mng/report/report-comment`;

    try {
        const response = await axios.post(
            url,
            { reason, commentId },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Comment reported successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error reporting comment:', error.response ? error.response.data : error.message);
        throw error;
    }
}



// get all plants

export const getAllPlants = async () => {
    url = `${BASE_URL}plants-mng/all-plants`
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching plants:', error);
        throw error;
    }
};
export const uploadImageForPrediction = async (photoUri) => {
    const url = `${BASE_URL}prediction-mng/upload`;
    const formData = new FormData();
    formData.append('file', {
        uri: photoUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
    });

    const options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData
    };

    try {
        const response = await axios.request(options);
        return response.data.data
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const makePrediction = async (cropId, imageUrl, location) => {
    const url = `${BASE_URL}prediction-mng/predict`;
    const payload = {
        cropId: cropId,
        image: imageUrl,
        location: [
            "-8.9175",
            "33.4629"
        ],
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Assuming this contains the prediction data
    } catch (error) {
        console.error('Error making prediction with payload:', payload, "and the error is:", error.response.data.message);
        throw error;
    }
};


export const handleImageUploadAndPredict = async (photoUri) => {
    try {
        const imageUrl = await uploadImageForPrediction(photoUri);
        const predictionData = await makePrediction(imageUrl);
        return predictionData;
    } catch (error) {
        console.error('Error in upload and prediction process:', error);
    }
};


// export const sendPredictionIds = async (ids) => {
//     const url = `${BASE_URL}prediction-mng/my-predictions`;
//     const options = {
//         method: 'POST',
//         // url: url,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         data: {
//             predictionsIds: ["e78b722e-4e0e-4368-9ea2-7bdc9be2b87a", "e78b722e-4e0e-4368-9ea2-7bdc9be2b87a"],
//             // predictionsIds: ids,
//         },
//     };

//     try {
//         const response = await axios(url, options);
//         console.log('Server response:', response.data);
//         return response;
//     } catch (error) {
//         console.error('Error sending prediction IDs:', error);
//         throw error;
//     }
// };


export const sendPredictionIds = async (ids) => {
    const url = `${BASE_URL}prediction-mng/my-predictions`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            predictionsIds: ids,
        }),
    };

    try {
        console.log("the payload is:", options.data);
        const response = await axios(url, options);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending prediction IDs:', error);
        throw error;
    }
};