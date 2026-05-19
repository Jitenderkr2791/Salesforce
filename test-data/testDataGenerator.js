import { faker } from '@faker-js/faker';
const uniqueNumber = `Account_${faker.person.firstName()}_${faker.number.int(10000)}`;

export function generateAccountData()
{
    return {
        accountName: `Test automation Account ${uniqueNumber}`
    };
}

export function generateOpportunityData(accountName)
{
    return {
        opportunityName: `Test automation Opportunity ${uniqueNumber}`,
        accountName: accountName,
        closeDate: '16/06/2026',
        stage: 'Prospecting'
    };
}