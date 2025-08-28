import axios from 'axios';

process.env.HTTP_PROXY = '';
process.env.http_proxy = '';
process.env.HTTPS_PROXY = '';
process.env.https_proxy = '';
axios.defaults.proxy = false;
