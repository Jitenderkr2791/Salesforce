import { faker } from '@faker-js/faker';

function generateUniqueId() {
    return `${faker.person.firstName()}_${faker.number.int(100000)}`;
}

export function generateAccountData(){
    return {
        accountName: `Account_${generateUniqueId()}`
    };
}

export function generateOpportunityData(accountName){
    return {
        opportunityName:`Opportunity_${generateUniqueId()}`,
        accountName: accountName,
        closeDate: '16/06/2026',
        stage: 'Prospecting'
    };
}