export const MERMAID_CHART_MOCK = `
graph LR;
        Group:iam-admins -- contains-user --> User:Josh 
        Group:iam-admins -- contains-user --> User:Pradeep 
        User:Josh -- has-policy --> Policy:TempPolicyDebugging 
        Group:iam-admins -- has-policy --> Policy:IAMAllAccess 
        Statement:IAMAllAccess-1 -- iam:DeleteUser --> User:Josh 
        Statement:IAMAllAccess-1 -- iam:DeleteUser --> User:Josh 
        Statement:IAMAllAccess-1 -- iam:DeleteUser --> User:Pradeep 
        Statement:IAMAllAccess-1 -- iam:DeleteUser --> User:Pradeep 
        Statement:IAMAllAccess-1 -- iam:ListUsers --> Service:IAM 

    
    `;
