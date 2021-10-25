import dotenv from 'dotenv';

dotenv.config();

export const config = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5885,
    SIIUAM: 'https://ayamictlan.uam.mx:8443/sae/azc/aewbf001.omuestraframes?mod=1',
    MISPROFESORES: 'https://www.misprofesores.com',
    TIMEOUT: 5_000,
    NAVIGATION: 15_000_000
} as const;