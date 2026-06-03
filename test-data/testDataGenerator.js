import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
const filePath = path.resolve('./test-data/generatedData.json');

function generateUniqueId()                                                             // Generate Unique Value
{
    return `${faker.person.firstName()}_${faker.number.int(100000)}`;
}

export function generateAccountData()                                                  // Generate Account Data Only
{
    const data = 
    {     
        account: {  accountName: `Account_${generateUniqueId()}` }   
     };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Account Data Generated');
    return data;
}

export function generateOpportunityData()                                            // Generate Opportunity Data Only
{
    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));            // Read existing account data
    const data = 
    {
        ...existingData,
        opportunity: {
                        opportunityName: `Opportunity_${generateUniqueId()}`,
                        accountName: existingData.account.accountName,
                        closeDate: '16/06/2026',
                        stage: 'Prospecting'
                     }
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Opportunity Data Generated');
    return data;
}

export function generateContactData()
{
    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));            // Read existing account data
    const data = 
    {
        ...existingData,
        contact: {
                    firstName: faker.person.firstName(),
                    accountName: existingData.account.accountName,
                    lastName: faker.person.lastName(),
                  }
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Contact Data Generated');
    return data;
}

export function getTestData()           // Read Test Data
{
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}