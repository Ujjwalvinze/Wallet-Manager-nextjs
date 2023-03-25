import { gql } from "@apollo/client";

const OWNER_TO_ACCOUNTS_ITEMS = gql`
    {
        ownerToAccounts {
            id
            ownerAccount
            account
        }
    }
`;

export default OWNER_TO_ACCOUNTS_ITEMS;
