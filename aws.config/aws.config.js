import dotenv from 'dotenv';
dotenv.config();

const credencials = {
    accessKeyID: process.env.accessKeyID,
    SecretAccessKey: process.env.SecretAccessKey
}

const region = process.env.region

export const config = {
    credenctials: credencials,
    region: region
};

