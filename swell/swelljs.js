import swell from 'swell-js'
import { SWELL_STORE_ID, SWELL_PUBLIC_KEY, SWELL_API_URL, SWELL_API_VAULT_URL } from './const'

swell.init(SWELL_STORE_ID, SWELL_PUBLIC_KEY, {
    url: SWELL_API_URL,
    vaultUrl: SWELL_API_VAULT_URL
});

export default swell
