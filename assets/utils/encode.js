import { JSEncrypt } from 'jsencrypt';

const encode = (str) => {
  var encrypt = new JSEncrypt();
  const privateKey =
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhhRduGuwkZcxQW5aGDEiO/IbLPpS9QJbq7EFb2o5BbZZnWyHz3qCpfMOYIDn6lR7/t7dI/tRZoCpn7+IJhyjbCeqp9nhNnMJJtFX+EJWvyECsUn3GJqU63H7pJpvIUEDC918/WnUBW+pEVek3Y+We5O5w+knYRRmEkj8N0zFMa9bnufGINUI+l2mOYMfG9nFF5q3MMvpxRkpu7mdrtUJ0JFBapUwoRmprsSSds16buVFtM9R8W3noFUxRHA5uBx6yHSrlWl9mDvgjsCzg4XtFOGBtBjMU0d9tqDkAPYxGKjPaCBDKt9vciQCz1Y6Iz80uYY3vKpiIseQJMENtObCAwIDAQAB';
  encrypt.setPublicKey(privateKey);
  var encryptMsg = encrypt.encrypt(str);
  return encryptMsg;
};
export default encode;
