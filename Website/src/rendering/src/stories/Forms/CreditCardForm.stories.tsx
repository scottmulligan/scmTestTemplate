import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreditCardForm from '../../components/Forms/CreditCardForm';

export default {
  title: 'Components/Forms/CreditCardForm',
  component: CreditCardForm,
} as ComponentMeta<typeof CreditCardForm>;

const Template: ComponentStory<typeof CreditCardForm> = (args) => <CreditCardForm {...args} />;

export const NewCreditCard = Template.bind({});
NewCreditCard.args = {
  onSubmit: (creditcard) => {
    alert(`Credit Card submitted successfully:\n${JSON.stringify(creditcard, null, 4)}`);
  },
};

export const ExistingCreditCard = Template.bind({});
ExistingCreditCard.args = {
  onSubmit: (creditcard) => {
    alert(`Credit Card submitted successfully:\n${JSON.stringify(creditcard, null, 4)}`);
  },
  creditCard: {
    ID: 'mockcreditcard',
    CardType: 'Visa',
    CardholderName: 'Jon Snow',
    PartialAccountNumber: '6123',
    ExpirationDate: new Date().toISOString(),
  },
};
