const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test data
const testRecord = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-123-4567',
    category: 'category1',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    status: 'active',
    notes: 'This is a test record created by the test script.'
};

// For storing created record ID
let createdRecordId;

// Test form submission
async function testSubmitForm() {
    console.log('Testing form submission...');
    try {
        const response = await axios.post(`${API_URL}/submit`, testRecord);
        
        if (response.data.success) {
            console.log('✅ Form submission successful');
            console.log('Created record:', response.data.record);
            createdRecordId = response.data.record._id;
            return true;
        } else {
            console.log('❌ Form submission failed:', response.data.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing form submission:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        return false;
    }
}

// Test fetching records
async function testFetchRecords() {
    console.log('\nTesting record retrieval...');
    try {
        const response = await axios.get(`${API_URL}/records`);
        
        if (response.data.success) {
            console.log(`✅ Successfully retrieved ${response.data.count} records`);
            return true;
        } else {
            console.log('❌ Record retrieval failed:', response.data.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing record retrieval:', error.message);
        return false;
    }
}

// Test Excel export functionality
async function testExcelExport() {
    console.log('\nTesting Excel export...');
    try {
        // Using axios with responseType blob to handle binary data
        const response = await axios.get(`${API_URL}/export`, {
            responseType: 'blob'
        });
        
        // Check if we got an Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
        if (response.headers['content-type'].includes('spreadsheetml')) {
            console.log('✅ Excel export successful');
            console.log(`File size: ${response.data.size} bytes`);
            return true;
        } else {
            console.log('❌ Excel export failed - incorrect content type:', response.headers['content-type']);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing Excel export:', error.message);
        return false;
    }
}

// Clean up - delete the test record
async function cleanUp() {
    if (!createdRecordId) {
        console.log('\nNo test record to clean up');
        return;
    }
    
    console.log('\nCleaning up test data...');
    try {
        const response = await axios.delete(`${API_URL}/records/${createdRecordId}`);
        
        if (response.data.success) {
            console.log('✅ Test record deleted successfully');
        } else {
            console.log('❌ Failed to delete test record:', response.data.message);
        }
    } catch (error) {
        console.error('❌ Error cleaning up test data:', error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('Starting To Clarity API tests...\n');
    
    // Test form submission
    const submitSuccess = await testSubmitForm();
    
    // Test fetching records
    const fetchSuccess = await testFetchRecords();
    
    // Test Excel export
    const exportSuccess = await testExcelExport();
    
    // Clean up
    await cleanUp();
    
    // Overall results
    console.log('\n--- Test Results Summary ---');
    console.log(`Form Submission: ${submitSuccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Record Retrieval: ${fetchSuccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Excel Export: ${exportSuccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log('\nTests completed.');
}

// Execute tests
runTests();